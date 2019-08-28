import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Interfaces as API } from '@lxdhub/common';
import { Subscription } from 'rxjs';

import { ImageCloneDialogComponent } from '../image-clone-dialog/image-clone-dialog.component';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image-detail',
  template: `
<section *ngIf="loaded">
  <div class="center-xs middle-xs column layout-padding layout-margin" *ngIf="error">
    <span class="layout-margin">
    {{ error }}
    </span>
  </div>
  <header class="image-detail-header col-xs-12 column middle-xs" *ngIf="!error">
    <div class="image-detail-header-content
      row
      col-lg-8
      col-lg-offset-2
      col-md-10
      col-md-offset-1
      col-sm-10
      col-sm-offset-1
      col-xs-12
      col-xs-offset-0">
      <div class="column col-xs layout-padding">
        <div class="image-description light-color">
          {{ getCleanDescription(image.description) }}
        </div>
      </div>
      <button [disabled]="!image.cloneable"
              [disableRipple]="true"
              (click)="openCloneDialog()"
              mat-raised-button
              color="accent"
              class="clone-image">Clone Image</button>
    </div>
    <section class="remote-list margin-padding">
      <section class="row
      col-lg-8
      col-lg-offset-2
      col-md-10
      col-md-offset-1
      col-sm-10
      col-sm-offset-1
      col-xs-12
      col-xs-offset-0">
        <mat-chip-list>
          <mat-chip
            *ngFor="let remote of image.remotes"
            color="accent"
            matTooltipPosition="above"
            [matTooltip]="getRemoteTooltip(remote)"
            [disabled]="!remote.available"
            [routerLink]="['/remote/' + remote.name + '/images']">
            {{remote.name}}
          </mat-chip>
        </mat-chip-list>
      </section>
    </section>
  </header>
  <div class="image-detail-content
  col-lg-8
  col-lg-offset-2
  col-md-10
  col-md-offset-1
  col-sm-10
  col-sm-offset-1
  col-xs-12
  col-xs-offset-0 column"
    *ngIf="!error">
    <h2 class="detail-overtitle">Detail</h2>
    <div>
      <app-image-clone-hint
        *ngIf="localClone.sourceRemote"
        [destinationRemote]="localClone.destinationRemote"
        [sourceRemote]="localClone.sourceRemote"
        [image]="image">
      </app-image-clone-hint>
    </div>
    <div>
      <span class="detail-title">Fingerprint</span> {{ image.fingerprint | slice:0:12 }}
    </div>
    <div *ngIf="image.operatingSystem">
      <span class="detail-title">Operating System</span>
      {{ image.operatingSystem.distribution }}
      {{ image.operatingSystem.release }}
      {{ image.operatingSystem.version }}
    </div>
    <div *ngIf="image.architecture">
      <span class="detail-title">Architecture</span> {{ image.architecture.humanName }} ({{image.architecture.processorName}})
    </div>
    <div>
      <span class="detail-title">Uploaded At</span> {{ image.uploadedAt }}
    </div>
    <div>
      <span class="detail-title">Created At</span> {{ image.createdAt }}
    </div>
    <div>
      <span class="detail-title">Expires At</span>{{ image.expiresAt }}
    </div>
    <div *ngIf="image.serial">
      <span class="detail-title">Serial</span> {{ image.serial }}
    </div>
    <div *ngIf="image.size">
      <span class="detail-title">Imagesize</span> {{ image.size }}
    </div>
    <div>
      <span class="detail-title">Public</span> {{ image.public }}
    </div>
    <div *ngIf="image.autoUpdate">
      <span class="detail-title">Auto Update</span> {{ image.autoUpdate }}
    </div>
    <div *ngIf="image.aliases.length">
      <span class="detail-title">Aliases</span>
      <ul>
        <li *ngFor="let alias of image.aliases">
          <strong>{{alias.name}}</strong>
          <span *ngIf="alias.description">: {{ alias.description }}</span>
        </li>
      </ul>
    </div>
  </div>
</section>
  `,
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent implements OnInit, OnDestroy {
  remoteIdSubscriber: Subscription;
  imageIdSubscriber: Subscription;
  remoteId: number;
  image: API.ImageDetailDto;
  loaded = false;
  error: string;
  localClone: any = {};

  /**
   * Initializes the ImageList Component
   * @param imageService The service to fetch images from the API interface
   * @param route The route service provided by angular
   * @param dialog The dialog service provided by angular material
   */
  constructor(
    private imageService: ImageService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  /**
   * Subscribes to the id-Url-parameter and
   * loads the image, if it changes
   */
  ngOnInit() {
    this.remoteIdSubscriber = this.route.params
      .subscribe(params => this.remoteId = params.remoteId);

    this.imageIdSubscriber = this.route.params
      .subscribe(params => this.loadImage(params.imageId));
  }

  /**
   * Returns a cleaner description of the image
   * @param description The raw description of the image
   */
  getCleanDescription(description: string) {
    return description.split('(')[0].trim();
  }

  getRemoteTooltip(remote: { name: string, available: boolean }) {
    const status = remote.available ? 'present' : 'not present';
    return `Image is ${status} on the "${remote.name}" remote`;
  }

  /**
   * Loads the image with the given id
   * @param id The id of the image
   */
  loadImage(id) {
    // Fetch the image from the api
    return this.imageService.findOne(id)
      .subscribe(
        response => {
          // Map image and bind it to the controller
          this.image = response.results;
          this.loaded = true;
          this.localClone.sourceRemote = this.image.remotes.filter(remote => remote.available)[0];
          this.localClone.destinationRemote = { name: 'local' };
        },
        () => {
          // Show error
          this.error = 'Image not found';
          this.loaded = true;
        });
  }

  /**
   * Gets called when the component gets unloaded
   * Unsubscribe from everything
   */
  ngOnDestroy() {
    this.imageIdSubscriber.unsubscribe();
    this.remoteIdSubscriber.unsubscribe();
  }

  /**
   * Opens the clone dialog
   */
  openCloneDialog() {
    const dialogRef = this.dialog.open(ImageCloneDialogComponent, {
      width: '650px',
      data: this.image
    });

    dialogRef
      .afterClosed()
      .subscribe(
        // Updates the image detail
        image => {
          if (image) {
            this.image = image;
          }
        });
  }
}
