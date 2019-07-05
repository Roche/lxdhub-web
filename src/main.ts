import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { APP_SETTINGS } from './settings';

const DEFAULT_SETTINGS = {
  hostUrl: '0.0.0.0',
  port: 4200,
  logLevel: 'silly',
  loggingUrl: 'http://0.0.0.0:3000/api/v1/log',
  apiUrl: 'http://0.0.0.0:3000/',
  package_version: '0.0.0'
};

const start = async () => {
  let settings;
  try {
    const response = await fetch('/config.json');
    settings = await response.json();
  } catch (err) {
    console.warn('Could not fetch config.json. Taking default config');
  } finally {
    settings = settings || DEFAULT_SETTINGS;
  }

  if (settings.googleAnalytics) {
    (window as any).gtag('config', settings.googleAnalytics);
  }

  // TODO: switch in dev mode
  enableProdMode();

  await platformBrowserDynamic([
    {
      useValue: settings,
      provide: APP_SETTINGS
    }
  ]).bootstrapModule<AppModule>(AppModule);
};

start();
