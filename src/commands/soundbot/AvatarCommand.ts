import { ClientUser, Message, Permissions } from 'discord.js';

import ICommand from '../base/ICommand';

export default class AvatarCommand implements ICommand {
  public readonly TRIGGERS = ['avatar'];
  public readonly USAGE = 'Usage: !avatar [remove]';
  private readonly ERRORS = {
    NO_AVATAR: 'Avatar not set yet. Try adding one with "!avatar" and an image!',
    TOO_FAST: 'You are changing your avatar too fast. Try again later.'
  };
  private readonly user: ClientUser;

  constructor(user: ClientUser) {
    this.user = user;
  }

  public run(message: Message, params: Array<string>) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (params.length === 1 && params[0] === 'remove') {
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

    this.user.setAvatar(message.attachments.first().url)
      .catch(() => message.channel.send(this.ERRORS.TOO_FAST));
  }

  private listAvatar(message: Message) {
    if (this.user.avatarURL === null) {
      message.channel.send(this.ERRORS.NO_AVATAR);
      return;
    }

    message.channel.send(`Current avatar: ${this.user.avatarURL}`);
  }
}
