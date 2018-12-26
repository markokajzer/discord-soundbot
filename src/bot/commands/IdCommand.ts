import { Message } from 'discord.js';

import ICommand from './base/ICommand';

export default class IdCommand implements ICommand {
  public readonly TRIGGERS = ['id'];
  public readonly NUMBER_OF_PARAMETERS = 0;
  public readonly USAGE = 'Usage: !id';

  public run(message: Message) {
    message.channel.send(message.author.username + ' -> ' + message.author.id);
  }
}
