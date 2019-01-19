import { Message } from 'discord.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import ytdl from 'ytdl-core';

import LocaleService from '@util/i18n/LocaleService';
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
    if (params.length < 2 || params.length > 4) return;

    const [name, link, start, end] = params;

    this.validator.validate(name, link)
      .then(() => this.addSound(link, name, parseFloat(start), parseFloat(end)))
      .then(result => message.channel.send(result))
      .catch(result => message.channel.send(result));
  }

  private addSound(url: string, filename: string, startTime: number, endTime: number) {
    return this.makeRequest(url)
      .then(() => this.convertToMp3(filename, startTime, endTime))
      .catch(this.handleError);
  }

  private makeRequest(url: string) {
    return new Promise((resolve, reject) => {
      ytdl(url, { filter: format => format.container === 'mp4'})
        .pipe(fs.createWriteStream('tmp.mp4'))
        .on('finish', resolve)
        .on('error', reject);
    });
  }

  private convertToMp3(name: string, startTime: number, endTime: number) {
    return this.convertWithFfmpeg(name, startTime, endTime)
      .then(() => this.cleanUp(name))
      .catch(this.handleError);
  }

  private convertWithFfmpeg(name: string, startTime: number, endTime: number) {
    let ffmpegCommand = ffmpeg('tmp.mp4');
    if (startTime >= 0) ffmpegCommand = ffmpegCommand.setStartTime(startTime);
    if (endTime >= startTime) ffmpegCommand = ffmpegCommand.setDuration(endTime - startTime);
    ffmpegCommand = ffmpegCommand.output(`./sounds/${name}.mp3`);

    return new Promise((resolve, reject) => {
      ffmpegCommand
        .on('end', resolve)
        .on('error', reject)
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
