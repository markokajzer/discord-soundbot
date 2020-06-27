import { Message, Permissions } from 'discord.js';

import * as ignoreList from '@util/db/IgnoreList';
import localize from '@util/i18n/localize';
import Config from '@config/Config';
import Command from './base/Command';
import userHasElevatedRole from './helpers/checkElevatedRights';

export default class UnignoreCommand implements Command {
  public readonly TRIGGERS = ['unignore'];
  public readonly USAGE = 'Usage: !unignore <user>';

  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public run(message: Message) {
    if (!message.member) return;

    const allowedToRunCommand = userHasElevatedRole(message.member.roles.cache);
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!) && !allowedToRunCommand) return;

    const { users } = message.mentions;
    if (users.size < 1) {
      message.channel.send(this.USAGE);
      message.channel.send(localize.t('helpers.userFinder.error'));
      return;
    }

    users.forEach(user => {
      ignoreList.remove(user.id);
      message.channel.send(localize.t('commands.ignore.remove', { user: user.username }));
    });
  }
}
