import { ClientUser, Message, Permissions } from 'discord.js';

import Config from '@config/Config';
import localize from '@util/i18n/localize';
import Command from './base/Command';

export default class ConfigCommand implements Command {
  public readonly TRIGGERS = ['config', 'set'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !config <option> <value>';

  private readonly config: Config;
  private user!: ClientUser;

  constructor(config: Config) {
    this.config = config;
  }

  public setClientUser(user: ClientUser) {
    this.user = user;
  }

  public run(message: Message, params: string[]) {
    if (!message.member) return;
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const [field, ...value] = params;

    if (!this.config.has(field)) {
      message.channel.send(localize.t('commands.config.notFound', { field }));
      return;
    }

    this.config.set(field, value);
    this.postProcess(field);
    message.channel.send(localize.t('commands.config.success', { field, value }));
  }

  private postProcess(field: string) {
    switch (field) {
      case 'game':
        this.user.setActivity(this.config.game);
        break;
      case 'language':
        localize.setLocale(this.config.language);
        break;
      default:
        break;
    }
  }
}
