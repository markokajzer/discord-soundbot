import Command from '../base/Command';

export default class HelpCommand implements Command {
  public readonly TRIGGERS = ['commands', 'help'];

  public run() {
    // noop
  }
}
