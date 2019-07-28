import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SyncRunService } from './sync-run.service';
import { SyncRunListComponent } from './sync-run-list.component';
import {
  MatPaginatorModule,
  MatIconModule,
  MatTooltipModule
} from '@angular/material';

const syncRunRoutes: Routes = [
  { path: 'sync', component: SyncRunListComponent }
];

@NgModule({
  declarations: [SyncRunListComponent],
  providers: [SyncRunService],
  imports: [
    CommonModule,
    RouterModule.forChild(syncRunRoutes),
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports: [RouterModule]
})
export class SyncRunModule {}
