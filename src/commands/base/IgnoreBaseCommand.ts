import { Message } from 'discord.js';

import BaseCommand from './BaseCommand';
import CommandUsage from './CommandUsage';

import DatabaseAdapter from '../../db/DatabaseAdapter';

export default abstract class IgnoreBaseCommand extends BaseCommand implements CommandUsage {
  public USAGE = '';
  protected readonly db: DatabaseAdapter;

  constructor(message: Message, db: DatabaseAdapter) {
    super(message);
    this.db = db;
  }

  protected getUsersFromMentions() {
    const users = this.message.mentions.users;
    if (users.size < 1) {
      this.message.channel.send(this.USAGE);
      this.message.channel.send('User not found on this server.');
      return;
    }

    return users;
  }
}
