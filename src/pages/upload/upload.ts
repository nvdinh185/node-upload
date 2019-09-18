import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage {

  isImageViewer: boolean = false;

  resourceImages: { imageViewer: any, file: any, name: string }[] = [];

  constructor(
    private httpClient: HttpClient) {
  }

  ngOnInit() {
  }

  /**
   * Khi chọn file thì xử lý file đó thành đường dẫn base64 và lưu vào mảng resourceImages
   * @param event 
   */
  fileChange(event) {

    if (event.target && event.target.files) {
      //dua vao mang file
      const files = event.target.files;
      //Lặp mảng files
      for (let key in files) { //index, length, item
        //nếu các đối tượng là file
        if (!isNaN(parseInt(key))) {
          //chi khoa index thoi
          //this.files.add(files[key]);
          //doc danh sach file vao image source view ra
          let reader = new FileReader();
          reader.readAsDataURL(files[key]);
          reader.onload = (kq: any) => {
            this.resourceImages.push(
              {
                imageViewer: kq.target.result, //ket qua doc file ra binary
                file: files[key], //doi tuong file goc
                name: files[key].name //ten file upload len
              }
            );
            this.isImageViewer = true;
          }
        }
      }
    }
  }


  deleteImage(evt) {
    //loc doi tuong xoa bo no di
    this.resourceImages = this.resourceImages.filter(value => value != evt)
  }

  shareImage(evt) {
    var formData: FormData = new FormData();
    formData.append('file2Upload', evt.file, evt.name);

    let url = "http://localhost:8080/file/file_upload";
    this.httpClient.post(url, formData)
      .toPromise()
      .then(data => {
        console.log(data);
        //neu thanh cong thi xoa anh
        this.resourceImages = this.resourceImages.filter((value => value != evt))
      })
      .catch(err => {
        console.log(err);
      });
  }

  onSubmit() {
    var formData: FormData = new FormData();
    var i = 0;
    this.resourceImages.forEach(fileObj => {
      formData.append('file2Upload' + i++, fileObj.file, fileObj.name);
    });

    this.httpClient.post('http://localhost:8080/file/file_upload', formData)
      .toPromise()
      .then(data => {
        console.log(data)
      })
      .catch(err => console.log(err));
  }
}
