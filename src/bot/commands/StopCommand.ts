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
    this.queue.clear();
    const { voiceConnection } = message.guild;
    if (voiceConnection) voiceConnection.disconnect();
  }
}
