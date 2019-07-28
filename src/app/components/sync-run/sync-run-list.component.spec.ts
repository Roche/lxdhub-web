import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncRunListComponent, SyncRunItem } from './sync-run-list.component';
import { SyncRunService } from './sync-run.service';
import { of } from 'rxjs';
import { Interfaces as API } from '@lxdhub/common';
import {
  MatIconModule,
  MatTooltipModule,
  MatPaginatorModule
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const state: API.SyncRunListResponseDto = {
  limit: 10,
  offset: 10,
  results: [
    {
      state: 2,
      id: 0,
      created: 0 as any,
      error: 'asdf'
    }
  ],
  total: 1
};

const syncRunServiceMock = {
  paginate: jasmine.createSpy('paginate').and.returnValue(of(state))
};

const routeMock = {
  queryParams: of({ limit: 10, offset: 0 })
};

const routerMock = {
  navigate: jasmine.createSpy('navigate')
};

describe('SyncRunListComponent', () => {
  let component: SyncRunListComponent;
  let fixture: ComponentFixture<SyncRunListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTooltipModule,
        MatIconModule,
        MatPaginatorModule,
        NoopAnimationsModule
      ],
      declarations: [SyncRunListComponent],
      providers: [
        {
          provide: SyncRunService,
          useValue: syncRunServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: routeMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncRunListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the url if pagination changes', () => {
    component.pagination$.next({ limit: 10, offset: 10 });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sync'], {
      queryParams: { offset: 10, limit: 10 }
    });
  });

  it('should call the SyncRunService correctly', () => {
    expect(syncRunServiceMock.paginate).toHaveBeenCalledWith({
      limit: 10,
      offset: 0
    });
  });

  describe('mapSyncRun', () => {
    let input: API.SyncRunItemDto;
    let output: SyncRunItem;

    beforeEach(() => {
      input = {
        created: 10 as any,
        id: 0,
        state: 1
      };
      output = {
        state: { text: 'Running', icon: 'sync', id: 'RUNNING' },
        time: 10 as any,
        error: '-'
      };
    });
    it('should correctly transform a object', () => {
      expect(component.mapSyncRun(input)).toEqual(output);
    });
  });

  describe('loadPage', () => {
    it('should correctly call syncRunService', () => {
      component.loadPage({ limit: 10, offset: 0 }).subscribe(data => {
        expect(syncRunServiceMock.paginate).toHaveBeenCalledWith({
          limit: 10,
          offset: 0
        });
        expect(data).toEqual({
          limit: 10,
          offset: 10,
          total: 1,
          syncRuns: [
            {
              state: {
                text: 'Failed',
                icon: 'error',
                id: 'FAILED'
              },
              time: 0 as any,
              error: 'asdf'
            }
          ]
        });
      });
    });
  });
});
