import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { UploadPage } from '../pages/upload/upload';

@NgModule({
  declarations: [
    MyApp,
    UploadPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    UploadPage
  ],
  providers: []
})
export class AppModule {}
