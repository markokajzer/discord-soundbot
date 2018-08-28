import { Message } from 'discord.js';

import config from '../../../config/config.json';

import ICommand from './base/ICommand';

import LocaleService from '../../i18n/LocaleService';
import SoundUtil from '../../util/SoundUtil';
import MessageChunker from '../helpers/MessageChunker';

export default class SoundsCommand implements ICommand {
  public readonly TRIGGERS = ['sounds'];
  private readonly localeService: LocaleService;
  private readonly chunker: MessageChunker;

  constructor(localeService: LocaleService, chunker: MessageChunker) {
    this.localeService = localeService;
    this.chunker = chunker;
  }

  public run(message: Message, params: Array<string>) {
    const sounds = SoundUtil.getSounds();

    if (!sounds.length) {
      message.author.send(this.localeService.t('sounds.notFound', { prefix: config.prefix }));
      return;
    }

    this.chunker.chunkedMessages(sounds, params)
                .forEach(chunk => message.author.send(chunk));
  }
}
