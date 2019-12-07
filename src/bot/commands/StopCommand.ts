import { Message } from 'discord.js';

import SoundQueue from '@queue/SoundQueue';
import Command from './base/Command';

export default class StopCommand implements Command {
  public readonly TRIGGERS = ['leave', 'stop'];
  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message) {
    if (!message.guild) return;
    if (!message.guild.voice) return;

    this.queue.clear();

    const { connection: voiceConnection } = message.guild.voice;
    if (voiceConnection) voiceConnection.disconnect();
  }
}
