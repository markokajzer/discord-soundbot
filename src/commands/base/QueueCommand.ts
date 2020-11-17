import SoundQueue from '~/queue/SoundQueue';

import Command from './Command';

export default abstract class QueueCommand extends Command {
  protected readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    super();
    this.queue = queue;
  }
}
