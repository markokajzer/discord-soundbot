import { ClientUser, Message } from 'discord.js';

import localize from '~/util/i18n/localize';

import BaseConfigCommand from '../base/ConfigCommand';
import UserCommand from '../base/UserCommand';

export class ConfigCommand extends BaseConfigCommand implements UserCommand {
  public readonly triggers = ['config', 'set'];
  public readonly numberOfParameters = 2;
  public readonly usage = 'Usage: !config <option> <value>';
  public readonly elevated = true;

  protected user!: ClientUser;

  public setClientUser(user: ClientUser) {
    this.user = user;
  }

  public run(message: Message, params: string[]) {
    if (params.length < this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const [field, ...value] = params;

    if (!this.config.has(field)) {
      message.channel.send(localize.t('commands.config.notFound', { field }));
      return;
    }

    const configValue = this.config.set(field, value)!;
    this.postProcess(field);

    message.channel.send(
      localize.t('commands.config.success', { field, value: configValue.toString() })
    );
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
