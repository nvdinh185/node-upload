var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer((req, res) => {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    //thư mục chứa files upload lên
    form.uploadDir = "uploads/";
    //Chép file đã chọn vào bộ nhớ tạm "C:\Users\DinhNV\AppData\Local\Temp\"
    form.parse(req, (err, fields, files) => {
      //đường dẫn lưu file tạm thời
      var oldpath = files.filetoupload.path; //C:\Users\DinhNV\AppData\Local\Temp\upload_057f6ec8fe1c25a7b3a954174cfc51dc
      //đường dẫn thực muốn lưu file
      var newpath = form.uploadDir + files.filetoupload.name;
      //di chuyển file từ đường dẫn tạm sang đường dẫn thực
      fs.rename(oldpath, newpath, err => {
        if (err) throw err;
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