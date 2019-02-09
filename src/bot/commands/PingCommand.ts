import { Message } from 'discord.js';

import Command from './base/Command';

export default class PingCommand implements Command {
  public readonly TRIGGERS = ['ping'];

  public run(message: Message) {
    message.channel.send('Pong!');
  }
}
