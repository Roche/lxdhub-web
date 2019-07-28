import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Interfaces as API } from '@lxdhub/common';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';

import { APP_SETTINGS, AppSettings } from '../../../settings';

/**
 * Interface to the LXDHub API for
 * Image operations.
 */
@Injectable()
export class ImageService {
  constructor(
    private http: HttpClient,
    private logger: NGXLogger,
    @Inject(APP_SETTINGS) private config: AppSettings) { }

  /**
   * Fetches the images with the given pagination options applied
   * @param options The pagination options which will be sent as query parameter
   */
  findByRemote(options: API.PaginationOptionsDto & { remote: string, query: string })
    : Observable<API.PaginationResponseDto<API.ImageListItemDto[]>> {
    // Set the query parameters
    let params = new HttpParams()
      .set('limit', options.limit.toString())
      .set('offset', options.offset.toString())
      .set('remote', options.remote.toString());

    if (options.query) {
      params = params.set('query', options.query.toString());
    }

    this.logger.debug(`Find images by remote ${options.remote}`, options);

    // Fetch the Images
    return this.http
      .get<API.PaginationResponseDto<API.ImageListItemDto[]>>(`${this.config.apiUrl}api/v1/image`, { params });
  }

  /**
   * Fetches one image with the given id
   * @param pagination The id of the image
   */
  findOne(id: number)
    : Observable<API.ResponseDto<API.ImageDetailDto>> {
    this.logger.debug(`Find one image: imageId#${id}`);
    return this.http
      .get<API.ResponseDto<API.ImageDetailDto>>(`${this.config.apiUrl}api/v1/image/${id}`);
  }

  /**
   * Clones the image
   * @param id The id of the image
   * @param cloneImageDto The clone image dto
   */
  cloneImage(id: number, cloneImageDto: API.CloneImageDto)
    : Observable<API.ResponseDto<{ uuid: string }>> {
    this.logger.debug(`Cloning image: imageId#${id}`, cloneImageDto);
    return this.http
      .post<API.ResponseDto<{ uuid: string }>>(`${this.config.apiUrl}api/v1/image/${id}/clone`, cloneImageDto);
  }
}
