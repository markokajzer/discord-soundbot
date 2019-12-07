import { ClientUser, Message, Permissions } from 'discord.js';

import Config from '@config/Config';
import localize from '@util/i18n/localize';
import UserCommand from './base/UserCommand';

export default class AvatarCommand implements UserCommand {
  public readonly TRIGGERS = ['avatar'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !avatar [remove]';

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

    if (params.length === this.NUMBER_OF_PARAMETERS && params[0] === 'remove') {
      this.user.setAvatar('');
      return;
    }

    if (message.attachments.size === 0) {
      this.listAvatar(message);
      return;
    }

    if (message.attachments.size !== 1) {
      message.channel.send(this.USAGE);
      return;
    }

    this.user
      .setAvatar(message.attachments.first()!.url)
      .catch(() => message.channel.send(localize.t('commands.avatar.errors.tooFast')));
  }

  private listAvatar(message: Message) {
    if (this.user.avatarURL === null) {
      message.channel.send(
        localize.t('commands.avatar.errors.noAvatar', { prefix: this.config.prefix })
      );
      return;
    }

    message.channel.send(localize.t('commands.avatar.url', { url: this.user.defaultAvatarURL }));
  }
}
