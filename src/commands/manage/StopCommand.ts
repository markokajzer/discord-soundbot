import Command from "../Command";

export class StopCommand extends Command {
  public readonly triggers = ["stop"];

  public async run(message: Message) {
    if (!message.guild) return;
    if (!message.guild.members.me) return;

    const { config, queue } = message.client;
    queue.clear();

    if (config.stayInChannel) {
      queue.next();
    } else {
      message.guild.members.me.voice.disconnect();
    }
  }
}
