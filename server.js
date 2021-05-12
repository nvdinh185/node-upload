const http = require('http');
const formidable = require('formidable');
const fs = require('fs');

const Excel = require('exceljs');
const wb = new Excel.Workbook();
const path = require('path');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

http.createServer((req, res) => {
  if (req.url == '/fileupload') {
    const form = new formidable.IncomingForm();
    //thư mục chứa files upload lên
    form.uploadDir = "uploads/";
    //Chép file đã chọn vào bộ nhớ tạm "C:\Users\DinhNV\AppData\Local\Temp\"
    form.parse(req, (err, fields, files) => {
      //đường dẫn lưu file tạm thời
      const oldpath = files.filetoupload.path; //C:\Users\DinhNV\AppData\Local\Temp\upload_057f6ec8fe1c25a7b3a954174cfc51dc
      //đường dẫn thực muốn lưu file
      const newpath = form.uploadDir + files.filetoupload.name;
      //di chuyển file từ đường dẫn tạm sang đường dẫn thực
      fs.rename(oldpath, newpath, err => {
        if (err) throw err;
        // Tiến hành đọc file excel đã upload lên
        const filePath = path.resolve(__dirname, newpath);
        wb.xlsx.readFile(filePath).then(() => {
          const sh = wb.getWorksheet("phone-number");
          const arData = [];
          sh.eachRow((row, rowNumber) => {
            if (rowNumber >= 2) {
              let jsonData = { id: row.getCell(1).value, phone: row.getCell(2).value };
              arData.push(jsonData);
            }
          });
          MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            const dbo = db.db("phone-number");
            dbo.collection("users").insertMany(arData, function (err, res) {
              if (err) throw err;
              console.log("Number of documents inserted: " + res.insertedCount);
              db.close();
            });
          });
          // console.log(arData);
        });
        res.end('File uploaded!');
      });
    });
    return;
  }

  //Render ra giao diện upload files
  res.writeHead('200', { 'Content-Type': 'text/html' });
  fs.readFile('index.html', 'utf8', (err, data) => {
    if (err) throw err;
    res.end(data);
  })

}).listen(8080, () => console.log("Server is running..."));