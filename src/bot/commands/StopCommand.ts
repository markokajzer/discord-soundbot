import { Message } from 'discord.js';

import Command from './base/Command';

import SoundQueue from '@util/queue/SoundQueue';

export default class StopCommand implements Command {
  public readonly TRIGGERS = ['leave', 'stop'];
  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message) {
    this.queue.clear();
    const voiceConnection = message.guild.voiceConnection;
    if (voiceConnection) voiceConnection.disconnect();
  }
}
