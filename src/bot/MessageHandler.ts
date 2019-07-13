import { Message } from 'discord.js';
import '../discord/Message';

import Config from '@config/Config';
import * as ignoreList from '@util/db/IgnoreList';
import CommandCollection from './CommandCollection';

export default class MessageHandler {
  private readonly config: Config;
  private readonly commands: CommandCollection;

  constructor(config: Config, commands: CommandCollection) {
    this.config = config;
    this.commands = commands;
  }

  public handle(message: Message) {
    if (!this.isValidMessage(message)) return;

    const messageToHandle = {
      ...message,
      content: message.content.substring(this.config.prefix.length)
    } as Message;

    this.commands.execute(messageToHandle);
  }

  private isValidMessage(message: Message) {
    return (
      !message.author.bot
      && !message.isDirectMessage()
      && message.hasPrefix(this.config.prefix)
      && !ignoreList.exists(message.author.id)
    );
  }
}
