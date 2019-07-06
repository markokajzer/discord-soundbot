import { Message, Permissions } from 'discord.js';

import * as ignoreList from '@util/db/IgnoreList';
import localize from '@util/i18n/localize';
import Command from './base/Command';
import UserFinder from './helpers/UserFinder';

export default class UnignoreCommand implements Command {
  public readonly TRIGGERS = ['unignore'];
  public readonly USAGE = 'Usage: !unignore <user>';
  private readonly userFinder: UserFinder;

  constructor(userFinder: UserFinder) {
    this.userFinder = userFinder;
  }

  public run(message: Message) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    this.userFinder.getUsersFromMentions(message, this.USAGE).forEach(user => {
      ignoreList.remove(user.id);
      message.channel.send(localize.t('commands.ignore.remove', { user: user.username }));
    });
  }
}
