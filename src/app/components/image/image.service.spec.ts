import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Interfaces as API } from '@lxdhub/common';
import { LoggerModule, NGXLogger } from 'ngx-logger';

import { SettingsMock, SettingsMockProvider } from '../../../settings.mock';
import { ImageService } from './image.service';

describe('ImageService', () => {
  let imageService: ImageService;
  let httpMock: HttpTestingController;
  beforeEach(async () => {
    const module = await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerModule
      ],
      providers: [
        ImageService,
        {
          provide: NGXLogger,
          useValue: { debug: () => {} }
        },
        SettingsMockProvider
      ]
    });

    imageService = module.get(ImageService);
    httpMock = module.get(HttpTestingController);
  });
  describe('findByRemote()', () => {
    it('should request to correct apiurl with query parameters', () => {
      const data = imageService.findByRemote({ remote: 'testremote', limit: 25, offset: 0, query: ''})
        .subscribe((response: API.PaginationResponseDto<API.ImageListItemDto[]>) => {
          expect(response.results[0].fingerprint).toBe('1');
        });

      const imageRequest = httpMock.expectOne(`${SettingsMock.apiUrl}api/v1/image?limit=25&offset=0&remote=testremote`);
      expect(imageRequest.request.method).toBe('GET');
      imageRequest.flush({ results: [{ fingerprint: '1' }] });
    });

    it('should request to correct apiurl with query parameters and a search string', () => {
      const data = imageService.findByRemote({ remote: 'testremote', limit: 25, offset: 0, query: 'os=ubuntu' })
        .subscribe((response: API.PaginationResponseDto<API.ImageListItemDto[]>) => {
          expect(response.results[0].fingerprint).toBe('1');
        });

      const imageRequest = httpMock
        .expectOne(`${SettingsMock.apiUrl}api/v1/image?limit=25&offset=0&remote=testremote&query=os=ubuntu`);
      expect(imageRequest.request.method).toBe('GET');
      imageRequest.flush({ results: [{ fingerprint: '1' }] });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });

  describe('findOne()', () => {
    it('should request to correct apiurl', () => {
      const data = imageService.findOne(1)
        .subscribe((response: API.ResponseDto<API.ImageDetailDto>) => {
          expect(response.results.fingerprint).toBe('1');
        });

      const imageRequest = httpMock.expectOne(`${SettingsMock.apiUrl}api/v1/image/1`);
      expect(imageRequest.request.method).toBe('GET');
      imageRequest.flush({ results: { fingerprint: '1' } });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
