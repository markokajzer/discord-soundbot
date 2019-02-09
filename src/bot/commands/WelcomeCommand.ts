import { Message } from 'discord.js';

import Command from './base/Command';

import Config from '@config/Config';
import LocaleService from '@util/i18n/LocaleService';

export default class WelcomeCommand implements Command {
  public readonly TRIGGERS = ['welcome'];
  private readonly config: Config;
  private readonly localeService: LocaleService;

  constructor(config: Config, localeService: LocaleService) {
    this.config = config;
    this.localeService = localeService;
  }

  public run(message: Message) {
    message.channel.send(this.localeService.t('welcome', { prefix: this.config.prefix }));
  }
}
