import { Message } from 'discord.js';

import LocaleService from '../../../util/i18n/LocaleService';

export default class UserFinder {
  private readonly localeService: LocaleService;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public getUsersFromMentions(message: Message, usage: string) {
    const users = message.mentions.users;
    if (users.size < 1) {
      message.channel.send(usage);
      message.channel.send(this.localeService.t('helpers.userFinder.error'));
    }

    return users;
  }
}
