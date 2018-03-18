import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundQueue from '../../queue/SoundQueue';

export default class StopCommand extends BaseCommand {
  public readonly TRIGGERS = ['leave', 'stop'];

  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    super();
    this.queue = queue;
  }

  public run(_: Message) {
    const current = this.queue.getCurrent();
    this.queue.clear();
    if (current) current.channel.leave();
  }
}
