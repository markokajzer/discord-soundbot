import QueueItem from "~/queue/QueueItem";
import localize from "~/util/i18n/localize";
import { existsSound } from "~/util/SoundUtil";

import Command from "../Command";

export class LoopCommand extends Command {
  public readonly triggers = ["loop", "repeat"];
  public readonly numberOfParameters = 2;
  public readonly usage = "Usage: !loop <sound> <count>";

  public async run(message: Message, params: string[]) {
    if (!message.member) return;

    if (params.length > this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const [sound, countAsString] = params;
    if (!existsSound(sound)) return;

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      await message.reply(localize.t("helpers.voiceChannelFinder.error"));
      return;
    }

    const count = Number.parseInt(countAsString, 10) || Number.MAX_SAFE_INTEGER;
    const item = new QueueItem(sound, voiceChannel, message, count);

    const { queue } = message.client;
    queue.add(item);
  }
}
