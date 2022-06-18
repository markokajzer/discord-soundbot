import { Message } from 'discord.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import util from 'util';
import YTDlpWrap from 'yt-dlp-wrap';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import axios from 'axios';

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
    if (params.length < 2 || params.length > 4) return;

    const [soundName, url, start, end] = params;

    try {
      this.validator.validate(soundName, url);
      await this.addSound({ end, soundName, start, url });
      message.channel.send(localize.t('commands.add.success', { name: soundName }));
    } catch (error) {
      this.handleError(message, error as Error);
    }
  }

  private async addSound({ url, start, end, soundName }: DownloadOptions) {
    const startTime = getSecondsFromTime(start) ?? 0;
    const endTime = getSecondsFromTime(end);
    const downloadId = uuidv4();

    await this.download(url, downloadId);
    await this.convert({ endTime, soundName, startTime, downloadId });
    await this.cleanUp(downloadId);
  }

  private downloadFile(url: string, path: string) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, { responseType: 'arraybuffer' })
        .then(response => {
          fs.writeFileSync(path, response.data, { encoding: 'binary' });
          fs.chmodSync('yt-dlp', '777');
          resolve(path);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  private async getDownloader() {
    const currentDate = format(new Date(), 'dd-MM-yyyy');
    let shouldCheckForUpdate = false;

    // Check each day for new yt-dlp updates
    try {
      const lastUpdatedDate = fs.readFileSync('.yt-dlp-last-updated', 'utf8');
      if (lastUpdatedDate !== currentDate) shouldCheckForUpdate = true;
      if (!fs.existsSync('yt-dlp')) shouldCheckForUpdate = true;
    } catch (e) {
      shouldCheckForUpdate = true;
    }

    if (shouldCheckForUpdate) {
      const tag = (await YTDlpWrap.getGithubReleases(1, 1))[0].tag_name;
      await this.downloadFile(
        `https://github.com/yt-dlp/yt-dlp/releases/download/${tag}/yt-dlp`,
        'yt-dlp'
      );
      fs.writeFileSync('.yt-dlp-last-updated', currentDate, { encoding: 'utf8' });
    }

    return new YTDlpWrap('./yt-dlp');
  }

  private download(url: string, downloadId: string = 'tmp') {
    return new Promise((resolve, reject) => {
      this.getDownloader().then(ytdl => {
        ytdl
          .execStream([url, '-f', 'best[ext=mp4]'])
          .pipe(fs.createWriteStream(`${downloadId}.mp4`))
          .on('finish', resolve)
          .on('error', reject);
      });
    });
  }

  private convert({ soundName, startTime, endTime, downloadId = 'tmp' }: ConvertOptions) {
    let ffmpegCommand = ffmpeg(`${downloadId}.mp4`).output(`./sounds/${soundName}.mp3`);

    ffmpegCommand = ffmpegCommand.setStartTime(startTime);
    if (endTime) ffmpegCommand = ffmpegCommand.setDuration(endTime - startTime);

    return new Promise((resolve, reject) =>
      ffmpegCommand.on('end', resolve).on('error', reject).run()
    );
  }

  private cleanUp(downloadId: string = 'tmp') {
    return unlink(`${downloadId}.mp4`);
  }
}
