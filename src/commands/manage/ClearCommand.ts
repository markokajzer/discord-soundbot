import Command from "../Command";

export class ClearCommand extends Command {
  public readonly triggers = ["clear"];

  public async run(message: Message) {
    if (!message.guild) return;
    if (!message.guild.members.me) return;

    const { queue } = message.client;
    queue.clear();
  }
}
