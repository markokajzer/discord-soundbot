import QueueItem from "~/queue/QueueItem";
import localize from "~/util/i18n/localize";
import { existsSound } from "~/util/SoundUtil";

import Command from "../Command";

export class SoundCommand extends Command {
  public readonly triggers = [];
  public readonly handlesDeletion = true;

  public async run(message: Message) {
    if (!message.member) return;

    const sound = message.content;
    if (!existsSound(sound)) return;

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      await message.reply(localize.t("helpers.voiceChannelFinder.error"));
      return;
    }

    const { queue } = message.client;
    queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
