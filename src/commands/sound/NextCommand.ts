import QueueItem from "~/queue/QueueItem";
import localize from "~/util/i18n/localize";
import { existsSound } from "~/util/SoundUtil";

import Command from "../Command";

export class NextCommand extends Command {
  public readonly triggers = ["next"];
  public readonly numberOfParameters = 1;
  public readonly usage = "!next <sound>";

  public async run(message: Message, params: string[]) {
    if (!message.member) return;

    if (params.length !== this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const [sound] = params;
    if (!existsSound(sound)) return;

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      await message.reply(localize.t("helpers.voiceChannelFinder.error"));
      return;
    }

    const { queue } = message.client;
    queue.addBefore(new QueueItem(sound, voiceChannel, message));
    queue.next();
  }
}
