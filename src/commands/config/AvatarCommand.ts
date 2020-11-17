import { ClientUser, Message } from 'discord.js';

import localize from '~/util/i18n/localize';

import ConfigCommand from '../base/ConfigCommand';
import UserCommand from '../base/UserCommand';
import userHasElevatedRole from '../util/userHasElevatedRole';

export class AvatarCommand extends ConfigCommand implements UserCommand {
  public readonly triggers = ['avatar'];
  public readonly numberOfParameters = 1;
  public readonly usage = 'Usage: !avatar [remove]';

  protected user!: ClientUser;

  public setClientUser(user: ClientUser) {
    this.user = user;
  }

  public run(message: Message, params: string[]) {
    if (!message.member) return;

    const allowedToRunCommand = userHasElevatedRole(message.member);
    if (!allowedToRunCommand) {
      message.channel.send(localize.t('errors.unauthorized'));
      return;
    }

    if (params.length === this.numberOfParameters && params[0] === 'remove') {
      this.user.setAvatar('');
      return;
    }

    if (message.attachments.size === 0) {
      this.listAvatar(message);
      return;
    }

    if (message.attachments.size !== 1) {
      message.channel.send(this.usage);
      return;
    }

    this.user
      .setAvatar(message.attachments.first()!.url)
      .catch(() => message.channel.send(localize.t('commands.avatar.errors.tooFast')));
  }

  private listAvatar(message: Message) {
    if (!this.user.avatarURL()) {
      message.channel.send(
        localize.t('commands.avatar.errors.noAvatar', { prefix: this.config.prefix })
      );
      return;
    }

    message.channel.send(
      localize.t('commands.avatar.url', {
        url: this.user.displayAvatarURL({ dynamic: true, format: 'png', size: 256 })
      })
    );
  }
}
