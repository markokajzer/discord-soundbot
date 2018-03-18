import config from '../config/config.json';

import Discord from 'discord.js';
import './discord/Message';

import CommandCollection from './commands/CommandCollection';
import DatabaseAdapter from './db/DatabaseAdapter';

export default class MessageHandler {
  private readonly db: DatabaseAdapter;
  private readonly commands: CommandCollection;
  private readonly prefix: string;

  constructor(db = new DatabaseAdapter(), commands = new CommandCollection(db), prefix = config.prefix) {
    this.db = db;
    this.commands = commands;
    this.prefix = prefix;
  }

  public handle(message: Discord.Message) {
    if (message.isDirectMessage()) return;
    if (!message.hasPrefix(this.prefix)) return;
    if (this.db.isIgnoredUser(message.author.id)) return;

    message.content = message.content.substring(this.prefix.length);

    const command = message.content.split(' ')[0];
    this.commands.execute(command, message);
  }
}
