import Command from '../../base/Command';

export class HelpCommand extends Command {
  public readonly triggers = ['commands', 'help'];

  public run() {
    // noop
  }
}
