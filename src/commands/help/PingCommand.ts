import { Message } from 'discord.js';

import Command from '../base/Command';

export class PingCommand implements Command {
  public readonly TRIGGERS = ['ping'];

  public run(message: Message) {
    message.channel.send('Pong!');
  }
}
