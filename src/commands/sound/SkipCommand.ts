import QueueCommand from '../base/QueueCommand';

export class SkipCommand extends QueueCommand {
  public readonly triggers = ['skip'];

  public async run() {
    this.queue.next();
  }
}
