import Command from "../../Command";

export class AvatarCommand extends Command {
  public readonly triggers = ["avatar"];
  public readonly elevated = true;

  public async run() {
    // noop
  }
}
