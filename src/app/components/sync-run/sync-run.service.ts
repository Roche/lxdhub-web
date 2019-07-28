import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';

import { AppSettings, APP_SETTINGS } from '../../../settings';
import { Interfaces as API } from '@lxdhub/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncRunService {
  constructor(
    private readonly http: HttpClient,
    private readonly logger: NGXLogger,
    @Inject(APP_SETTINGS) private readonly config: AppSettings
  ) {}

  /**
   * Paginate through the sync run list
   * @param options The pagination options
   */
  paginate(
    options: API.PaginationOptionsDto
  ): Observable<API.SyncRunListResponseDto> {
    const params = new HttpParams()
      .set('limit', options.limit.toString())
      .set('offset', options.offset.toString());

    this.logger.debug(`Find sync runs`, options);

    return this.http.get<API.SyncRunListResponseDto>(
      `${this.config.apiUrl}api/v1/sync-run`,
      { params }
    );
  }
}
