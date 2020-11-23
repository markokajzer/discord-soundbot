import { Message } from 'discord.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import util from 'util';
import ytdl from 'ytdl-core';

import getSecondsFromTime from '~/util/getSecondsFromTime';
import localize from '~/util/i18n/localize';

import DownloadOptions, { ConvertOptions } from '../CommandOptions';
import YoutubeValidator from '../validator/YoutubeValidator';
import BaseDownloader from './BaseDownloader';

const unlink = util.promisify(fs.unlink);

export default class YoutubeDownloader extends BaseDownloader {
  protected readonly validator: YoutubeValidator;

  constructor(youtubeValidator: YoutubeValidator) {
    super();
    this.validator = youtubeValidator;
  }

  public async handle(message: Message, params: string[]) {
    // TODO: Move this check to AddCommand
    if (params.length < 2 || params.length > 4) return;

    const [soundName, url, startTime, endTime] = params;

    try {
      this.validator.validate(soundName, url);
      await this.addSound({ endTime, soundName, startTime, url });
      message.channel.send(localize.t('commands.add.success', { name: soundName }));
    } catch (error) {
      this.handleError(message, error);
    }
  }

  private async addSound({ url, ...convertOptions }: DownloadOptions) {
    await this.download(url);
    await this.convert(convertOptions);
    await this.cleanUp();
  }

  private download(url: string) {
    return new Promise((resolve, reject) => {
      ytdl(url, { filter: format => format.container === 'mp4' })
        .pipe(fs.createWriteStream('tmp.mp4'))
        .on('finish', resolve)
        .on('error', reject);
    });
  }

  private convert({ soundName, startTime, endTime }: ConvertOptions) {
    let ffmpegCommand = ffmpeg('tmp.mp4').output(`./sounds/${soundName}.mp3`);

    const start = getSecondsFromTime(startTime);
    const end = getSecondsFromTime(endTime);

    if (start) ffmpegCommand = ffmpegCommand.setStartTime(start);
    if (start && end) ffmpegCommand = ffmpegCommand.setDuration(end - start);

    return new Promise((resolve, reject) =>
      ffmpegCommand.on('end', resolve).on('error', reject).run()
    );
  }

  private cleanUp() {
    return unlink('tmp.mp4');
  }
}
