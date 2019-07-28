import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

import { RemoteSelectComponent } from './remote-select/remote-select.component';
import { RemoteService } from './remote.service';
import { MatSnackBarModule } from '@angular/material';
import { RemoteHintComponent } from './remote-hint/remote-hint.component';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  declarations: [
    RemoteSelectComponent,
    RemoteHintComponent
  ],
  providers: [
    RemoteService,
  ],
  exports: [
    RemoteSelectComponent,
    RemoteHintComponent
  ]
})
/**
 * The module for remote related operations
 */
export class RemoteModule { }
