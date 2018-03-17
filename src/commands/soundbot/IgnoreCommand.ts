import { Permissions } from 'discord.js';

import IgnoreBaseCommand from '../base/IgnoreBaseCommand';

export class IgnoreCommand extends IgnoreBaseCommand {
  public readonly USAGE = 'Usage: !ignore <user>';

  public run() {
    // @REVIEW How to extract this method into a Interface / Mixin, so that
    // all restricted Commands can have call the same method instead of this duplication
    // Another subclass could be potentially bad.
    if (!this.message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    const users = this.getUsersFromMentions();
    if (!users) return;

    users.forEach(user => {
      this.db.addIgnoredUser(user.id);
      this.message.channel.send(`Ignoring ${user.username}!`);
    });
  }
}
