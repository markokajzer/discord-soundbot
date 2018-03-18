import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

import SoundQueue from '../../queue/SoundQueue';

export default class StopCommand implements ICommand {
  public readonly TRIGGERS = ['leave', 'stop'];

  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(_: Message) {
    const current = this.queue.getCurrent();
    this.queue.clear();
    if (current) current.channel.leave();
  }
}
