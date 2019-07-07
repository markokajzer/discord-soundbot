import { Message } from 'discord.js';

import Config from '@config/Config';
import localize from '@util/i18n/localize';
import Command from './base/Command';

export default class WelcomeCommand implements Command {
  public readonly TRIGGERS = ['welcome'];
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public run(message: Message) {
    message.channel.send(localize.t('welcome', { prefix: this.config.prefix }));
  }
}
