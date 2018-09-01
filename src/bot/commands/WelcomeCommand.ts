import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import Config from '@config/Config';
import LocaleService from '@util/i18n/LocaleService';

export default class WelcomeCommand implements ICommand {
  public readonly TRIGGERS = ['welcome'];
  private readonly config: Config;
  private readonly localeService: LocaleService;

  constructor(config: Config, localeService: LocaleService) {
    this.config = config;
    this.localeService = localeService;
  }

  public run(message: Message, _: Array<string>) {
    message.channel.send(this.localeService.t('welcome', { prefix: this.config.prefix }));
  }
}
