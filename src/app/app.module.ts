import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule } from 'ng-socket-io';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageModule } from './components/image/image.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LxdLogoComponent } from './components/shared/lxd-logo/lxd-logo.component';
import { FooterComponent } from './components/footer/footer.component';
import { SyncRunModule } from './components/sync-run/sync-run.module';

@NgModule({
  declarations: [
    AppComponent,
    LxdLogoComponent,
    NavigationComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    ImageModule,
    AppRoutingModule,
    SocketIoModule,
    SyncRunModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.DEBUG
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
