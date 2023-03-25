import { Message } from 'discord.js';

import QueueCommand from '../base/QueueCommand';

export class StopCommand extends QueueCommand {
  public readonly triggers = ['leave', 'stop'];

  public run(message: Message) {
    if (!message.guild) return;
    if (!message.guild.members.me) return;

    this.queue.clear();

    message.guild.members.me.voice.disconnect();
  }
}
