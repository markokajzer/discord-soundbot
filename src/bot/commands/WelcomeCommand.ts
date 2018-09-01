import { Message } from 'discord.js';

import config from '@config/config.json';

import ICommand from './base/ICommand';

import LocaleService from '@util/i18n/LocaleService';

export default class WelcomeCommand implements ICommand {
  public readonly TRIGGERS = ['welcome'];
  private readonly localeService: LocaleService;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public run(message: Message, _: Array<string>) {
    message.channel.send(this.localeService.t('welcome', { prefix: config.prefix }));
  }
}
