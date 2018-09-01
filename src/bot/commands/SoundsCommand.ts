import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import Config from '@config/Config';
import LocaleService from '@util/i18n/LocaleService';
import SoundUtil from '@util/SoundUtil';
import MessageChunker from './helpers/MessageChunker';

export default class SoundsCommand implements ICommand {
  public readonly TRIGGERS = ['sounds'];
  private readonly config: Config;
  private readonly localeService: LocaleService;
  private readonly chunker: MessageChunker;

  constructor(config: Config, localeService: LocaleService, chunker: MessageChunker) {
    this.config = config;
    this.localeService = localeService;
    this.chunker = chunker;
  }

  public run(message: Message, params: Array<string>) {
    const sounds = SoundUtil.getSounds();

    if (!sounds.length) {
      message.author.send(this.localeService.t('sounds.notFound', { prefix: this.config.prefix }));
      return;
    }

    this.chunker.chunkedMessages(sounds, params)
                .forEach(chunk => message.author.send(chunk));
  }
}
