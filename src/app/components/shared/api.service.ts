import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Interfaces as API } from '@lxdhub/common';
import { APP_SETTINGS, AppSettings } from '../../../settings';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    @Inject(APP_SETTINGS) private config: AppSettings
  ) {}

  getApiInfo() {
    return this.http
      .get<API.APIDto>(`${this.config.apiUrl}api/v1`)
      .pipe(shareReplay(1));
  }
}
