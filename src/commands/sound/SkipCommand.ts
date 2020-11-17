import QueueCommand from '../base/QueueCommand';

export class SkipCommand extends QueueCommand {
  public readonly triggers = ['skip'];

  public run() {
    this.queue.next();
  }
}
