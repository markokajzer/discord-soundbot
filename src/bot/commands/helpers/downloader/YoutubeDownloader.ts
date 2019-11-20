import fs from 'fs';

import { Message } from 'discord.js';
import { FFmpeg } from 'prism-media';
import { spawn } from 'child_process';
import ytdl from 'ytdl-core';

import localize from '@util/i18n/localize';
import BaseDownloader from './BaseDownloader';
import YoutubeValidator from './validator/YoutubeValidator';

export default class YoutubeDownloader extends BaseDownloader {
  protected readonly validator: YoutubeValidator;

  constructor(youtubeValidator: YoutubeValidator) {
    super();
    this.validator = youtubeValidator;
  }

  public handle(message: Message) {
    const params = message.content.split(' ');
    if (params.length < 2 || params.length > 4) return;

    const [name, link, start, end] = params;

    this.validator
      .validate(name, link)
      .then(() => this.addSound(link, name, start, end))
      .then(result => message.channel.send(result))
      .catch(result => message.channel.send(result));
  }

  private addSound(
    url: string,
    filename: string,
    startTime: string | undefined,
    endTime: string | undefined
  ) {
    return this.download(url)
      .then(() => this.convert(filename, startTime, endTime))
      .then(() => this.cleanUp(filename))
      .catch(this.handleError);
  }

  private download(url: string) {
    return new Promise((resolve, reject) => {
      ytdl(url, { filter: format => format.container === 'mp4' })
        .pipe(fs.createWriteStream('tmp.mp4'))
        .on('finish', resolve)
        .on('error', reject);
    });
  }

  private convert(name: string, startTime: string | undefined, endTime: string | undefined) {
    let args = ['-i', 'tmp.mp4', '-ar', '48000', '-ac', '2'];
    if (startTime) args.push('-ss', startTime);
    if (endTime) args.push('-to', endTime);
    args.push(`./sounds/${name}.mp3`);

    return new Promise((resolve, reject) => {
      const transcoder = spawn(FFmpeg.getInfo().command, args);
      transcoder.on('close', resolve).on('error', reject);
    });
  }

  private cleanUp(name: string) {
    fs.unlinkSync('tmp.mp4');
    return Promise.resolve(localize.t('commands.add.success', { name }));
  }

  private handleError(error: Error) {
    console.error(error);
    return Promise.reject(localize.t('commands.add.error'));
  }
}
