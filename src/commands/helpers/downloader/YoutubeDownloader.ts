import { Message } from 'discord.js';
import fs from 'fs';
import ytdl from 'ytdl-core';

import LocaleService from '../../../i18n/LocaleService';
import IDownloader from './IDownloader';
import YoutubeValidator from './validator/YoutubeValidator';

export default class YoutubeDownloader implements IDownloader {
  private readonly localeService: LocaleService;
  private readonly validator: YoutubeValidator;

  constructor(localeService: LocaleService, youtubeValidator: YoutubeValidator) {
    this.localeService = localeService;
    this.validator = youtubeValidator;
  }

  public handle(message: Message) {
    const params = message.content.split(' ');
    if (params.length !== 2) return;

    const [name, link] = params;
    this.saveValidUrl(name, link).then(result => message.channel.send(result))
                                 .catch(result => message.channel.send(result));
  }

  private saveValidUrl(name: string, link: string) {
    return this.validator.validate(name, link)
                         .then(() => this.addSoundFromUrl(name, link));
  }

  private addSoundFromUrl(name: string, url: string) {
    ytdl(url, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(`./sounds/${name}.mp3`));

    return Promise.resolve(this.localeService.t('add.success', { name }));
  }
}
