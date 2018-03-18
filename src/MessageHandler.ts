import config from '../config/config.json';

import { Message } from 'discord.js';
import './discord/Message';

import CommandCollection from './commands/CommandCollection';
import DatabaseAdapter from './db/DatabaseAdapter';

export default class MessageHandler {
  private readonly db: DatabaseAdapter;
  private readonly commands: CommandCollection;
  private readonly prefix: string;

  constructor(db = new DatabaseAdapter(), commands = new CommandCollection(), prefix = config.prefix) {
    this.db = db;
    this.commands = commands;
    this.prefix = prefix;
  }

  public handle(message: Message) {
    if (!this.isValidMessage(message)) return;

    message.content = message.content.substring(this.prefix.length);
    const [command, ...params] = message.content.split(' ');

    this.commands.execute(command, params, message);
  }

  private isValidMessage(message: Message) {
    return !message.isDirectMessage() &&
           message.hasPrefix(this.prefix) &&
           !this.db.isIgnoredUser(message.author.id);
  }
}
