import { Message } from 'discord.js';
import '../discord/Message';

import Config from '@config/Config';
import DatabaseAdapter from '@util/db/DatabaseAdapter';
import CommandCollection from './CommandCollection';

export default class MessageHandler {
  private readonly config: Config;
  private readonly db: DatabaseAdapter;
  private readonly commands: CommandCollection;

  constructor(config: Config, commands: CommandCollection, db: DatabaseAdapter) {
    this.config = config;
    this.db = db;
    this.commands = commands;
  }

  public handle(message: Message) {
    if (!this.isValidMessage(message)) return;

    message.content = message.content.substring(this.config.prefix.length);
    const [command, ...params] = message.content.split(' ');

    this.commands.execute(command, params, message);
  }

  private isValidMessage(message: Message) {
    if(this.config.admin && this.config.admin !== '') {
      if(message.author.id !== this.config.admin) return false;
    }
    return !message.isDirectMessage() &&
           message.hasPrefix(this.config.prefix) &&
           !this.db.ignoreList.exists(message.author.id);
  }
}
