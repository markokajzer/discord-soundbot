import Command from "../Command";

export class LeaveCommand extends Command {
  public readonly triggers = ["leave"];

  public async run(message: Message) {
    if (!message.guild) return;
    if (!message.guild.members.me) return;

    const { queue } = message.client;
    queue.clear();

    message.guild.members.me.voice.disconnect();
  }
}
