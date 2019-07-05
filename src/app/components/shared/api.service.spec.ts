import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { SettingsMockProvider } from '../../../settings.mock';
import { APP_SETTINGS, AppSettings } from '../../../settings';
import { APIDto } from '@lxdhub/interfaces';

describe('ApiService', () => {
  let apiService: ApiService;
  let httpMock: HttpTestingController;
  let settings: AppSettings;

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SettingsMockProvider, ApiService]
    });

    apiService = testBed.get(ApiService);
    httpMock = testBed.get(HttpTestingController);
    settings = testBed.get(APP_SETTINGS);
  });

  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });

  describe('getApiInfo', () => {
    it('should call the correct url', () => {
      apiService
        .getApiInfo()
        .subscribe(data =>
          expect(data).toEqual({ package_version: '1.0.0' } as APIDto)
        );
      const request = httpMock.expectOne(`${settings.apiUrl}api/v1`);
      expect(request.request.method).toBe('GET');
      request.flush({ package_version: '1.0.0' });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
