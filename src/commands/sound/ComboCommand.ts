import QueueItem from "~/queue/QueueItem";
import localize from "~/util/i18n/localize";
import { getSounds } from "~/util/SoundUtil";

import Command from "../Command";

export class ComboCommand extends Command {
  public readonly triggers = ["combo"];
  public readonly numberOfParameters = 1;
  public readonly usage = "Usage: !combo <sound1> ... <soundN>";

  public async run(message: Message, params: string[]) {
    if (!message.member) return;

    if (params.length < this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      await message.reply(localize.t("helpers.voiceChannelFinder.error"));
      return;
    }

    const sounds = getSounds();

    params.forEach((sound) => {
      if (!sounds.includes(sound)) return;

      const { queue } = message.client;
      const item = new QueueItem(sound, voiceChannel, message);
      queue.add(item);
    });
  }
}
