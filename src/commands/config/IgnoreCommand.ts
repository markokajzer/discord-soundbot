import { Message } from 'discord.js';

import * as ignoreList from '~/util/db/IgnoreList';
import localize from '~/util/i18n/localize';

import Command from '../base/Command';

export class IgnoreCommand extends Command {
  public readonly triggers = ['ignore'];
  public readonly usage = 'Usage: !ignore <user>';
  public readonly elevated = true;

  public async run(message: Message) {
    const { users } = message.mentions;
    if (users.size < 1) {
      await message.edit(this.usage);
      await message.channel.send(localize.t('helpers.userFinder.error'));
      return;
    }

    await users.forEach(user => {
      ignoreList.add(user.id);
      message.edit(localize.t('commands.ignore.add', { user: user.username }));
    });
  }
}
