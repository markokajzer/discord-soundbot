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

  public run(message: Message, params: string[]) {
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

    this.user.setAvatar(message.attachments.first()!.url).catch(() => {
      message.channel.send(localize.t('commands.avatar.errors.tooFast'));
    });
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
        url: this.user.displayAvatarURL({ size: 256 })
      })
    );
  }
}
