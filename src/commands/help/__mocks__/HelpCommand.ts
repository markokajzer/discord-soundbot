import Command from "../../Command";

export class HelpCommand extends Command {
  public readonly triggers = ["commands", "help"];

  public async run() {
    // noop
  }
}
