import { Message } from 'discord.js';

import Command from '../base/Command';

export class PingCommand extends Command {
  public readonly triggers = ['ping'];

  public run(message: Message) {
    message.channel.send('Pong!');
  }
}
