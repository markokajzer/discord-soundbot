import { Permissions } from 'discord.js';

import IgnoreBaseCommand from '../base/IgnoreBaseCommand';

export class UnignoreCommand extends IgnoreBaseCommand {
  public readonly USAGE = 'Usage: !unignore <user>';

  public run() {
    if (!this.message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    const users = this.getUsersFromMentions();
    if (!users) return;

    users.forEach(user => {
      this.db.removeIgnoredUser(user.id);
      this.message.channel.send(`No longer ignoring ${user.username}!`);
    });
  }
}
