import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundQueue from '../../queue/SoundQueue';

export class StopCommand extends BaseCommand {
  private readonly queue: SoundQueue;

  constructor(message: Message, queue: SoundQueue) {
    super(message);
    this.queue = queue;
  }

  public run() {
    const current = this.queue.getCurrent();
    this.queue.clear();
    if (current) current.channel.leave();
  }
}
