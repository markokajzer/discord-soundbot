import { ClientUser, Message, Permissions } from 'discord.js';

import Command from './base/Command';

import Config from '@config/Config';
import LocaleService from '@util/i18n/LocaleService';

export default class ConfigCommand implements Command {
  public readonly TRIGGERS = ['config'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !config <option> <value>';

  private readonly config: Config;
  private readonly localeService: LocaleService;
  private user!: ClientUser;

  constructor(config: Config, localeService: LocaleService) {
    this.config = config;
    this.localeService = localeService;
  }

  public setClientUser(user: ClientUser) {
    this.user = user;
  }

  public run(message: Message, params: Array<string>) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const [field, ...value] = params;

    if (!this.config.has(field)) {
      message.channel.send(this.localeService.t('config.notFound', { field }));
      return;
    }

    this.config.set(field, value);
    this.postProcess(field);
    message.channel.send(this.localeService.t('config.success', { field, value }));
  }

  private postProcess(field: string) {
    switch (field) {
      case 'game':
        this.user.setActivity(this.config.game);
        break;
      case 'language':
        this.localeService.setLocale(this.config.language);
    }
  }
}
