import { Message } from 'discord.js';

import Config from '@config/Config';
import localize from '@util/i18n/localize';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';
import MessageChunker from './helpers/MessageChunker';

export default class SoundsCommand implements Command {
  public readonly TRIGGERS = ['sounds'];

  private readonly config: Config;
  private readonly chunker: MessageChunker;

  constructor(config: Config, chunker: MessageChunker) {
    this.config = config;
    this.chunker = chunker;
  }

  public run(message: Message, params: string[]) {
    const sounds = getSounds();

    if (!sounds.length) {
      message.author.send(localize.t('commands.sounds.notFound', { prefix: this.config.prefix }));
      return;
    }

    const page = parseInt(params[0]);

    this.chunker.chunkedMessages(sounds, page)
      .forEach(chunk => message.author.send(chunk));
  }
}
