import Command from "../Command";

export class SkipCommand extends Command {
  public readonly triggers = ["skip"];

  public async run(message: Message) {
    const { queue } = message.client;
    queue.next();
  }
}
