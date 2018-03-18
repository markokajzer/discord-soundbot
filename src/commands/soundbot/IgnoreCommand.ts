import { Message, Permissions } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';

export default class IgnoreCommand extends BaseCommand {
  public readonly TRIGGERS = ['ignore'];
  public readonly USAGE = 'Usage: !ignore <user>';
  private readonly db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    super();
    this.db = db;
  }

  public run(message: Message) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    const users = message.mentions.users;
    if (users.size < 1) {
      message.channel.send(this.USAGE);
      message.channel.send('User not found on this server.');
      return;
    }

    users.forEach(user => {
      this.db.addIgnoredUser(user.id);
      message.channel.send(`Ignoring ${user.username}!`);
    });
  }
}
