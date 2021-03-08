import { ClientUser, Message } from 'discord.js';

import localize from '~/util/i18n/localize';

import ConfigCommand from '../base/ConfigCommand';
import UserCommand from '../base/UserCommand';

export class AvatarCommand extends ConfigCommand implements UserCommand {
  public readonly triggers = ['avatar'];
  public readonly numberOfParameters = 1;
  public readonly usage = 'Usage: !avatar [remove]';
  public readonly elevated = true;

  protected user!: ClientUser;

  public setClientUser(user: ClientUser) {
    this.user = user;
  }

  public async run(message: Message, params: string[]) {
    if (params.length === this.numberOfParameters && params[0] === 'remove') {
      await this.user.setAvatar('');
      return;
    }

    if (message.attachments.size === 0) {
      this.listAvatar(message);
      return;
    }

    if (message.attachments.size !== 1) {
      await message.edit(this.usage);
      return;
    }

    await this.user
      .setAvatar(message.attachments.first()!.url)
      .catch(() => message.edit(localize.t('commands.avatar.errors.tooFast')));
  }

  private async listAvatar(message: Message) {
    if (!this.user.avatarURL()) {
      await message.edit(
        localize.t('commands.avatar.errors.noAvatar', { prefix: this.config.prefix })
      );
      return;
    }

    await message.edit(
      localize.t('commands.avatar.url', {
        url: this.user.displayAvatarURL({ dynamic: true, format: 'png', size: 256 })
      })
    );
  }
}
