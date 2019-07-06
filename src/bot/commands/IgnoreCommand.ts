import { Message, Permissions } from 'discord.js';

import * as ignoreList from '@util/db/IgnoreList';
import localize from '@util/i18n/localize';
import Command from './base/Command';
import UserFinder from './helpers/UserFinder';

export default class IgnoreCommand implements Command {
  public readonly TRIGGERS = ['ignore'];
  public readonly USAGE = 'Usage: !ignore <user>';
  private readonly userFinder: UserFinder;

  constructor(userFinder: UserFinder) {
    this.userFinder = userFinder;
  }

  public run(message: Message) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    this.userFinder.getUsersFromMentions(message, this.USAGE).forEach(user => {
      ignoreList.add(user.id);
      message.channel.send(localize.t('commands.ignore.add', { user: user.username }));
    });
  }
}
