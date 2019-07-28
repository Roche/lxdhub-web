import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Interfaces as API } from '@lxdhub/common';

import { SyncRunService } from './sync-run.service';
import { ReplaySubject, of } from 'rxjs';
import { PageEvent } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { map } from 'rxjs/operators/map';
import {
  switchMap,
  distinctUntilChanged,
  catchError,
  retry
} from 'rxjs/operators';

export interface SyncState {
  icon: string;
  text: string;
  id: string;
}

export interface SyncRunItem {
  time: number;
  error?: string;
  state: SyncState;
}

export interface SyncRunListState {
  syncRuns: SyncRunItem[];
  total: number;
  limit: number;
  offset: number;
  error?: string;
}

@Component({
  selector: 'app-sync-run-list',
  template: `
    <section
      class="layout-padding
  col-lg-8
  col-lg-offset-2
  col-md-10
  col-md-offset-1
  col-sm-10
  col-sm-offset-1
  col-xs-12
  col-xs-offset-0"
    >
      <div
        class="center-xs middle-xs column layout-padding layout-margin"
        *ngIf="state && state.error"
      >
        <span class="layout-margin">
          {{ state.error }}
        </span>
      </div>

      <table class="sync-run-list" *ngIf="state">
        <thead>
          <tr>
            <th>State</th>
            <th class="time-column">Started</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          <tr class="sync-run-list-item" *ngFor="let syncRun of state.syncRuns">
            <td>
              <div
                [matTooltip]="syncRun.state.text"
                [className]="
                  'sync-state sync-state-' + syncRun.state.id.toLowerCase()
                "
              >
                <mat-icon
                  aria-hidden="false"
                  aria-label="Synchronization State"
                  >{{ syncRun.state.icon }}</mat-icon
                >
              </div>
            </td>
            <td class="time-column">{{ syncRun.time | date: 'medium' }}</td>
            <td>{{ syncRun.error }}</td>
          </tr>
        </tbody>
      </table>
      <mat-paginator
        *ngIf="state"
        (page)="onPaginationChange($event)"
        [length]="state.total"
        [pageSize]="state.limit"
        [pageSizeOptions]="[5, 10, 25, 100]"
      >
      </mat-paginator>
    </section>
  `,
  styleUrls: ['./sync-run-list.component.css']
})
export class SyncRunListComponent implements OnInit, OnDestroy {
  private initialState: SyncRunListState = {
    limit: 25,
    offset: 0,
    syncRuns: [],
    total: 0,
    error: null
  };
  private syncStates: SyncState[] = [
    {
      text: 'Not started',
      icon: 'more_horiz',
      id: 'NOT_STARTED'
    },
    { text: 'Running', icon: 'sync', id: 'RUNNING' },
    { text: 'Failed', icon: 'error', id: 'FAILED' },
    {
      text: 'Succeeded',
      icon: 'done',
      id: 'SUCCEEDED'
    }
  ];

  state: SyncRunListState = this.initialState;
  state$ = of<SyncRunListState>(this.state);

  pagination$ = new ReplaySubject<{ limit: number; offset: number }>();

  constructor(
    private readonly syncRunService: SyncRunService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    const params$ = this.route.queryParams;

    params$
      .pipe(untilDestroyed(this))
      .subscribe(params => this.onParamChange(params));

    this.pagination$.subscribe(pagination => this.updateUrl(pagination));

    this.state$ = this.pagination$.pipe(
      untilDestroyed(this),
      distinctUntilChanged(
        (prev, curr) => prev.limit === curr.limit && prev.offset === curr.offset
      ),
      switchMap(param => this.loadPage(param))
    );

    this.state$
      .pipe(untilDestroyed(this))
      .subscribe(
        (state: SyncRunListState) => (this.state = state),
        (err: Error) => (this.state.error = err.message)
      );
  }

  updateUrl(pagination: API.PaginationOptionsDto) {
    this.router.navigate(['/sync'], {
      queryParams: { offset: pagination.offset, limit: pagination.limit }
    });
  }

  mapSyncRun(syncRun: API.SyncRunItemDto): SyncRunItem {
    return {
      time: syncRun.created as any,
      error: syncRun.error || '-',
      state: this.syncStates[syncRun.state]
    };
  }

  loadPage(pagination: API.PaginationOptionsDto) {
    return this.syncRunService
      .paginate({
        offset: pagination.offset,
        limit: pagination.limit
      })
      .pipe(
        map(
          (result): SyncRunListState => ({
            limit: result.limit,
            offset: result.offset,
            syncRuns: result.results.map(syncRun => this.mapSyncRun(syncRun)),
            total: result.total
          })
        ),
        retry(3)
      );
  }

  onParamChange(params: Params) {
    this.pagination$.next({
      limit: parseInt(params.limit, 10) || 25,
      offset: parseInt(params.offset, 10) || 0
    });
  }

  /**
   * Gets called when the pagination options change.
   * Sets the pagination options, depending on the given mat-paginatior event.
   * Then reloads the images.
   * @param event The material paginator event
   */
  onPaginationChange(event: PageEvent) {
    this.pagination$.next({
      offset: event.pageSize * event.pageIndex,
      limit: event.pageSize
    });
  }

  ngOnDestroy(): void {}
}
