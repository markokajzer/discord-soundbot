import { ClientUser, Message, Permissions } from 'discord.js';

import config from '../../../config/config.json';

import IUserCommand from './base/IUserCommand';

import LocaleService from '../../i18n/LocaleService';

export default class AvatarCommand implements IUserCommand {
  public readonly TRIGGERS = ['avatar'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !avatar [remove]';
  private readonly localeService: LocaleService;
  private user!: ClientUser;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public setClientUser(user: ClientUser) {
    this.user = user;
  }

  public run(message: Message, params: Array<string>) {
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

    this.user.setAvatar(message.attachments.first().url)
             .catch(() => message.channel.send(this.localeService.t('avatar.errors.tooFast')));
  }

  private listAvatar(message: Message) {
    if (this.user.avatarURL === null) {
      message.channel.send(this.localeService.t('avatar.errors.noAvatar', { prefix: config.prefix }));
      return;
    }

    message.channel.send(this.localeService.t('avatar.url', { url: this.user.avatarURL }));
  }
}
