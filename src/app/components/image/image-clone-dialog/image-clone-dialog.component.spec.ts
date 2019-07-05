import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule,
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { from, Subscription } from 'rxjs';

import { ImageCloneHintComponent } from '../image-clone-hint/image-clone-hint.component';
import { ImageService } from '../image.service';
import { ImageSocket } from '../image.socket';
import { ImageCloneDialogComponent } from './image-clone-dialog.component';

class MatDialogRefMock {
  close() { }
}

class ImageServiceMock {
  cloneImage(number, options) { }
}

class ImageSocketMock {
  getCloneStatus(id, uuid, imageId) { }
}
describe('ImageCloneDialogComponent', () => {
  let component: ImageCloneDialogComponent;
  let fixture: ComponentFixture<ImageCloneDialogComponent>;
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;
  let imageService: ImageService;
  let imageSocket: ImageSocket;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      declarations: [
        ImageCloneHintComponent,
        ImageCloneDialogComponent
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 1, remotes: [{ cloneAble: true, id: 1 }, { cloneAble: false, id: 2, available: true }] }
        },
        {
          provide: ImageService,
          useClass: ImageServiceMock
        },
        {
          provide: ImageSocket,
          useClass: ImageSocketMock
        }
      ]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ImageCloneDialogComponent]
      }
    });

    imageService = TestBed.get(ImageService);
    imageSocket = TestBed.get(ImageSocket);

    TestBed.compileComponents();
  }));

  beforeEach(inject([MatDialog, OverlayContainer],
    (d: MatDialog, oc: OverlayContainer) => {
      dialog = d;
      overlayContainer = oc;
    })
  );

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCloneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should open a dialog with a component', () => {
    const dialogRef = dialog.open(ImageCloneDialogComponent, {
      data: { param: '1' }
    });

    // verify
    expect(dialogRef.componentInstance instanceof ImageCloneDialogComponent).toBe(true);
  });

  it('should correctly call imageservice onSubmit', () => {
    spyOn(imageService, 'cloneImage').and.callFake(() => from([{ results: { uuid: '1' } }]));
    spyOn(component, 'waitForCloneOperation').and.callThrough();
    component.selectedDestination = { id: 1 };
    component.selectedSource = { id: 2 };
    component.image = { id: 1 };
    component.onSubmit();

    expect(imageService.cloneImage).toHaveBeenCalledWith(1, { destinationRemoteId: 1, sourceRemoteId: 2 });
    expect(component.waitForCloneOperation).toHaveBeenCalledWith('1');
  });

  it('should correctly call imageservice waitForCloneOperation', () => {
    spyOn(imageSocket, 'getCloneStatus').and.callFake(() => from([{ results: { uuid: '1' } }]));
    spyOn(component, 'closeDialog').and.callFake(() => { });
    component.selectedDestination = { id: 1 };
    component.image = { id: 1 };
    component.waitForCloneOperation('1');
    expect(component.isFormLocked).toBe(false);
  });
});
