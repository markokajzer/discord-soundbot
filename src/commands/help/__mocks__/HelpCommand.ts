import Command from '../../base/Command';

export class HelpCommand implements Command {
  public readonly TRIGGERS = ['commands', 'help'];

  public run() {
    // noop
  }
}
