import Command from "../../base/Command";
import type UserCommand from "../../base/UserCommand";

export class AvatarCommand extends Command implements UserCommand {
  public readonly triggers = ["avatar"];
  public readonly elevated = true;

  public setClientUser() {
    // noop
  }

  public run() {
    // noop
  }
}
