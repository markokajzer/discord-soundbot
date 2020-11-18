import Command from '../../base/Command';
import UserCommand from '../../base/UserCommand';

export class AvatarCommand extends Command implements UserCommand {
  public readonly triggers = ['avatar'];
  public readonly elevated = true;

  public setClientUser() {
    // noop
  }

  public run() {
    // noop
  }
}
