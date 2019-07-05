// These are important and needed before anything else
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

import { Interfaces, LogType, WinstonLogger } from '@lxdhub/common';
import * as Chalk from 'chalk';
import * as express from 'express';
import { join } from 'path';

import { LXDHubWebSettings } from './lxdhubwebsettings.interface';
import { Application } from 'express';

export class LXDHubWeb implements Interfaces.ILXDHubHttpService {
  private logger: WinstonLogger;
  private distFolder: string = join(__dirname, '../');
  private browserDistFolder: string = join(this.distFolder, 'browser');
  private url: string;

  constructor(private settings: LXDHubWebSettings, private app?: Application) {
    this.logger = new WinstonLogger('LXDHubWeb', settings.logLevel as LogType);
    this.url = `http://${this.settings.hostUrl}:${this.settings.port}`;
    try {
      const packageJson = require('../../package.json');
      this.settings = { ...this.settings, package_version: packageJson.version };
    } catch (err) {
      this.logger.warn('Could not find local package.json');
    }
  }

  private setupNgRendering() {
    this.app.use(express.static(this.browserDistFolder));
    this.app.get('/config.json', (_, res) => res.json(this.settings));
    // Match everything, except when it begins with /api
    this.app.get(/^(?!\/(api|socket.io)).*$/, (_, res) =>
      res.sendFile(join(this.browserDistFolder, 'index.html'))
    );
  }

  private async listen() {
    this.app.listen(this.settings.port, this.settings.hostUrl, () =>
      this.logger.log(`Running webinterface on ` + Chalk.default.blue(this.url))
    );
    try {
      this.logger.log(
        `Set configuration: ${Chalk.default.blue(
          JSON.stringify(this.settings)
        )}`
      );
    } catch (ex) {}
  }

  public async bootstrap(): Promise<Application> {
    if (!this.app) {
      this.app = express();
    }
    this.setupNgRendering();
    return this.app;
  }

  /**
   * Runs the webinterface with the set settings
   */
  async run() {
    try {
      await this.bootstrap();
    } catch (err) {
      err = err as Error;
      this.logger.error(`An error occured while bootstraping the application`);
      this.logger.error(err.message);
    }
    return await this.listen();
  }
}
