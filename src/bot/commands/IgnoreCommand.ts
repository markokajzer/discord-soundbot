import { Message, Permissions } from 'discord.js';

import * as ignoreList from '@util/db/IgnoreList';
import localize from '@util/i18n/localize';
import Command from './base/Command';

export default class IgnoreCommand implements Command {
  public readonly TRIGGERS = ['ignore'];
  public readonly USAGE = 'Usage: !ignore <user>';

  public run(message: Message) {
    if (!message.member) return;
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    const { users } = message.mentions;
    if (users.size < 1) {
      message.channel.send(this.USAGE);
      message.channel.send(localize.t('helpers.userFinder.error'));
      return;
    }

    users.forEach(user => {
      ignoreList.add(user.id);
      message.channel.send(localize.t('commands.ignore.add', { user: user.username }));
    });
  }
}
