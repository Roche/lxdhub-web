import { APP_SETTINGS, AppSettings } from './settings';

export const SettingsMock: AppSettings = {
  apiUrl: 'localhost:3000',
  loggingUrl: 'localhost:3000/api/v1/log',
  logLevel: 'silly',
  package_version: '1.0.1',
};

export const SettingsMockProvider = {
    useValue: SettingsMock,
    provide: APP_SETTINGS
};
