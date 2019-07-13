import UserCommand from '../base/UserCommand';

export default class AvatarCommand implements UserCommand {
  public readonly TRIGGERS = ['avatar'];

  public setClientUser() {
    // noop
  }

  public run() {
    // noop
  }
}
