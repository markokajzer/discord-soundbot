import { Message } from 'discord.js';

import QueueCommand from '../base/QueueCommand';

export class StopCommand extends QueueCommand {
  public readonly triggers = ['leave', 'stop'];

  public async run(message: Message) {
    if (!message.reference!.guildID) return;

    this.queue.clear();

    const originalMsg = await message.referencedMessage();
    const { connection: voiceConnection } = originalMsg.guild!.voice!;
    if (voiceConnection) voiceConnection.disconnect();
  }
}
