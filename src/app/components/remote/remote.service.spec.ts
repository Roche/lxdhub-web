import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Interfaces } from '@lxdhub/common';

import { RemoteService } from './remote.service';
import { NGXLogger } from 'ngx-logger';
import { SettingsMockProvider, SettingsMock } from '../../../settings.mock';

describe('RemoteService', () => {
  let remoteService: RemoteService;
  let httpMock: HttpTestingController;
  beforeEach(async () => {
    const module = await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RemoteService,
        {
          provide: NGXLogger,
          useValue: { debug: () => { } }
        },
        SettingsMockProvider
      ]
    });

    remoteService = module.get(RemoteService);
    httpMock = module.get(HttpTestingController);
  });
  describe('findAll()', () => {
    it('should request to correct apiurl', () => {
      const data = remoteService.findAll()
        .subscribe((response: Interfaces.ResponseDto<Interfaces.RemoteDto[]>) => {
          expect(response.results[0].name).toBe('1');
        });

      const remoteRequest = httpMock.expectOne(`${SettingsMock.apiUrl}api/v1/remote`);
      expect(remoteRequest.request.method).toBe('GET');
      remoteRequest.flush({ results: [{ name: '1' }] });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
