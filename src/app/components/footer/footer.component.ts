import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { of } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { APP_SETTINGS, AppSettings } from '../../../settings';
import { tap } from 'rxjs/operators';

export interface FooterState {
  version: string;
  webVersion: string;
  apiVersion: string;
}

@Component({
  selector: 'app-footer',
  template: `
    <footer class="middle-xs center-xs">
      <div>
        <a class="primary-color" href="https://lxdhub.xyz">LXDHub</a>
      </div>
      <small>
        <span>{{ (state$ | async)?.version }}</span>
      </small>
    </footer>
  `,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  constructor(
    private apiService: ApiService,
    @Inject(APP_SETTINGS) private appSettings: AppSettings
  ) {}

  state$: Observable<FooterState>;

  ngOnInit(): void {
    const webPackageVersion$: Observable<string> = of(
      this.appSettings.package_version
    );
    const apiPackageVersion$: Observable<
      string
    > = this.apiService.getApiInfo().pipe(
      untilDestroyed(this),
      map(apiInfo => apiInfo.package_version)
    );

    this.state$ = combineLatest([apiPackageVersion$, webPackageVersion$]).pipe(
      untilDestroyed(this),
      map(
        ([apiVersion, webVersion]) =>
          ({
            apiVersion,
            webVersion,
            version: ''
          } as FooterState)
      ),
      map(state =>
        state.apiVersion
          ? { ...state, version: state.version + `api v${state.apiVersion} ` }
          : state
      ),
      map(state =>
        state.webVersion
          ? { ...state, version: state.version + `web v${state.webVersion}` }
          : state
      )
    );
  }

  ngOnDestroy(): void {}
}
