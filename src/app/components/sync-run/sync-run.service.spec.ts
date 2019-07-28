import { TestBed, getTestBed } from '@angular/core/testing';

import { SyncRunService } from './sync-run.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { NGXLogger } from 'ngx-logger';
import { APP_SETTINGS } from '../../../settings';

const appSettingsMock = {
  apiUrl: 'http://localhost:3000/'
};

describe('SyncRunService', () => {
  let service: SyncRunService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SyncRunService,
        {
          provide: NGXLogger,
          useValue: { debug: jasmine.createSpy().and.callThrough() }
        },
        {
          provide: APP_SETTINGS,
          useValue: appSettingsMock
        }
      ],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(SyncRunService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request the correct address', () => {
    service.paginate({ limit: 10, offset: 0 }).subscribe(data => {
      expect(data.results[0].id).toBe(0);
    });
    const req = httpMock.expectOne('http://localhost:3000/api/v1/sync-run?limit=10&offset=0');
    expect(req.request.method).toBe('GET');
    req.flush({ limit: 10, offset: 0, total: 1, results: [{ id: 0 }] });
  });
});
