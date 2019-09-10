import { Component } from '@angular/core';

import { UploadPage } from '../pages/upload/upload';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = UploadPage;

  constructor() {}
}

