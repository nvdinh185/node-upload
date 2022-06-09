const http = require('http');
const formidable = require('formidable');
const fs = require('fs');

const path = require('path');

http.createServer((req, res) => {
  if (req.url == '/fileupload') {
    const form = new formidable.IncomingForm();
    //thư mục chứa files upload lên
    const dirUpload = "uploads/";
    form.uploadDir = dirUpload;
    const formData = { params: {}, files: {} };

    //Tạo thư mục chứa file upload
    if (!fs.existsSync(dirUpload)) {
      fs.mkdirSync(dirUpload);
    }
    //Chép file đã chọn vào nhưng chưa đổi tên
    form.parse(req, (err, fields, files) => {
      for (const key in fields) {
        Object.defineProperty(formData.params, key, {
          value: fields[key],
          enumerable: true //cho phep gan thanh thuoc tinh truy van sau khi hoan thanh
        });
      }
      //tên file tạm thời
      const oldpath = files.filetoupload.path; //upload_057f6ec8fe1c25a7b3a954174cfc51dc
      //tên file mới
      const newpath = form.uploadDir + files.filetoupload.name;
      //đổi tên file
      fs.rename(oldpath, newpath, err => {
        if (err) throw err;
        // in ra đường dẫn file đã upload lên
        const filePath = path.resolve(__dirname, newpath);
        const key = "file";
        Object.defineProperty(formData.files, key, {
          value: {
            url: filePath
          },
          enumerable: true //cho phep gan thanh thuoc tinh truy van sau khi hoan thanh
        });
        console.log(formData);
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

}).listen(8080, () => console.log("Server is running in port 8080..."));