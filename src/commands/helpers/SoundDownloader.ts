import fs from 'fs';
import { IncomingMessage } from 'http';
import https from 'https';

import LocaleService from '../../i18n/LocaleService';

export default class SoundDownloader {
  private readonly localeService: LocaleService;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public download(fileName: string, url: string) {
    return new Promise((resolve, reject) => {
      this.requestURL(url, fileName, resolve)
          .on('error', error => this.handleError(error, reject));
    });
  }

  private requestURL(url: string, fileName: string, resolve: any) {
    return https.get(url, response => {
      if (response.statusCode === 200) {
        this.saveResponseToFile(response, fileName);
        resolve(this.localeService.t('add.success', { name: fileName.split('.')[0] }));
      }
    });
  }

  private saveResponseToFile(response: IncomingMessage, fileName: string) {
    const file = fs.createWriteStream(`./sounds/${fileName}`);
    response.pipe(file);
  }

  private handleError(error: Error, reject: any) {
    console.error(error);
    reject(this.localeService.t('add.error'));
  }
}
