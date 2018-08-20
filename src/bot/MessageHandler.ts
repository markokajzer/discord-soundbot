import { Message } from 'discord.js';
import '../discord/Message';

import config from '../../config/config.json';

import DatabaseAdapter from '../db/DatabaseAdapter';
import CommandCollection from './CommandCollection';

export default class MessageHandler {
  private readonly db: DatabaseAdapter;
  private readonly commands: CommandCollection;
  private readonly prefix: string;

  constructor(commands: CommandCollection, db: DatabaseAdapter) {
    this.db = db;
    this.commands = commands;
    this.prefix = config.prefix;
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
