import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent, FooterState } from './footer.component';
import { ApiService } from '../shared/api.service';

import { of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { APIDto } from '@lxdhub/interfaces';
import { SettingsMockProvider } from '../../../settings.mock';

const apiServiceMock = {
  getApiInfo: jasmine
    .createSpy()
    .and.returnValue(
      of({ package_version: '1.0.0' } as APIDto).pipe(shareReplay(1))
    )
};

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let apiService: ApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ApiService,
          useValue: apiServiceMock
        },
        SettingsMockProvider
      ],
      declarations: [FooterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);

    component = fixture.componentInstance;
    apiService = fixture.debugElement.injector.get(ApiService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch API info data', () => {
    component.ngOnInit();

    expect(apiService.getApiInfo).toHaveBeenCalled();

    component.state$.subscribe({
      next: (state: FooterState) => expect(state.apiVersion).toBe('1.0.0')
    });
  });

  it('should use APP_SETTINGS package_version', () => {
    component.ngOnInit();

    component.state$.subscribe({
      next: (state: FooterState) => expect(state.webVersion).toBe('1.0.1')
    });
  });

  it('should correctly concat the version', () => {
    component.ngOnInit();

    component.state$.subscribe({
      next: (state: FooterState) => expect(state.version).toBe('api v1.0.0 web v1.0.1')
    });
  });
});
