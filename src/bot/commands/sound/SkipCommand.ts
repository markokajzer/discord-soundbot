import SoundQueue from '~/queue/SoundQueue';

import Command from '../base/Command';

export class SkipCommand implements Command {
  public readonly TRIGGERS = ['skip'];

  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run() {
    this.queue.next();
  }
}
