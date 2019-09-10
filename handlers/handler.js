const dirUpload = 'upload_files';
const formidable = require('formidable');
const fs = require('fs');
const systempath = require('path');
const mime = require('mime-types');
if (!fs.existsSync(dirUpload)) fs.mkdirSync(dirUpload);

const postFile = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    let formData = { params: {}, files: {} };

    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(JSON.stringify({ message: 'Parse Formdata Error', error: err }));
    } else {
      for (let key in fields) {
        //gan them thuoc tinh dynamic
        Object.defineProperty(formData.params, key, {
          value: fields[key], //gia tri bien duoc bind vao bindVars.p_in_0,1,...n
          writable: false, //khong cho phep sua du lieu sau khi gan gia tri vao
          enumerable: true //cho phep gan thanh thuoc tinh truy van sau khi hoan thanh
        });
      }

      let count_file = 0;
      for (let key in files) {

        let curdatetime = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/-/g, '').replace(/:/g, '');
        let curMonth = curdatetime.slice(0, 6);
        let curDate = curdatetime.slice(6, 8);
        let curTime = curdatetime.slice(9)
        if (!fs.existsSync(dirUpload + systempath.sep + curMonth)) fs.mkdirSync(dirUpload + systempath.sep + curMonth);
        if (!fs.existsSync(dirUpload + systempath.sep + curMonth + systempath.sep + curDate)) fs.mkdirSync(dirUpload + systempath.sep + curMonth + systempath.sep + curDate);

        //luu file theo duong dan he thong
        let filenameStored = dirUpload + systempath.sep
          + curMonth + systempath.sep
          + curDate + systempath.sep
          //+ curTime + "_"
          + files[key].size + "_"
          + files[key].name;

        //duong dan truy cap kieu web
        let urlFileName = dirUpload + "/"
          + curMonth + "/"
          + curDate + "/"
          + files[key].size + "_"
          + files[key].name;

        fs.createReadStream(files[key].path)
          .pipe(fs.createWriteStream(filenameStored));

        count_file++;

        let contentType = 'image/jpeg';
        if (mime.lookup(files[key].name)) contentType = mime.lookup(files[key].name);

        //vi da tinh hop le cua token roi
        Object.defineProperty(formData.files, key, {
          value: {
            url: urlFileName
            , file_name: files[key].name
            , file_size: files[key].size
            , file_type: contentType
          }, //gia tri bien duoc bind vao bindVars.p_in_0,1,...n
          writable: false, //khong cho phep sua du lieu sau khi gan gia tri vao
          enumerable: true //cho phep gan thanh thuoc tinh truy van sau khi hoan thanh
        });

      }

      formData.params.count_file = count_file;
      req.form_data = formData;

      res.writeHead(202, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(JSON.stringify({ message: 'Đã lưu file vào!'}));
    }
  });
}

module.exports = {
  postFile: postFile
};