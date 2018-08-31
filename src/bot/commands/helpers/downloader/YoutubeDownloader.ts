import { Message } from 'discord.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import ytdl from 'ytdl-core';

import LocaleService from '../../../../util/i18n/LocaleService';
import BaseDownloader from './BaseDownloader';
import YoutubeValidator from './validator/YoutubeValidator';

export default class YoutubeDownloader extends BaseDownloader {
  protected readonly validator: YoutubeValidator;

  constructor(localeService: LocaleService, youtubeValidator: YoutubeValidator) {
    super(localeService);
    this.validator = youtubeValidator;
  }

  public handle(message: Message) {
    const params = message.content.split(' ');
    if (params.length !== 2) return;

    const [name, link] = params;

    this.validator.validate(name, link)
      .then(() => this.addSound(link, name))
      .then(result => message.channel.send(result))
      .catch(result => message.channel.send(result));
  }

  private addSound(url: string, filename: string) {
    return this.makeRequest(url)
      .then(() => this.convertToMp3(filename))
      .catch(error => this.handleError(error));
  }

  private makeRequest(url: string) {
    return new Promise((resolve, reject) => {
      ytdl(url, { filter: format => format.container === 'mp4'})
        .pipe(fs.createWriteStream('tmp.mp4'))
        .on('finish', () => resolve())
        .on('error', error => reject(error));
    });
  }

  private convertToMp3(name: string) {
    return this.convertWithFfmpeg(name)
      .then(() => this.cleanUp(name))
      .catch(error => this.handleError(error));
  }

  private convertWithFfmpeg(name: string) {
    return new Promise((resolve, reject) => {
      ffmpeg('tmp.mp4')
        .output(`./sounds/${name}.mp3`)
        .on('end', () => resolve())
        .on('error', error => reject(error))
        .run();
    });
  }

  private cleanUp(name: string) {
    fs.unlinkSync('tmp.mp4');
    return Promise.resolve(this.localeService.t('add.success', { name }));
  }

  private handleError(error: Error) {
    console.error(error);
    return Promise.reject(this.localeService.t('add.error'));
  }
}
