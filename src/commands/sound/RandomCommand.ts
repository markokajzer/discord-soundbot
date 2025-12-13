import QueueItem from "~/queue/QueueItem";
import * as soundsDb from "~/util/db/Sounds";
import localize from "~/util/i18n/localize";
import { getSounds } from "~/util/SoundUtil";

import Command from "../Command";

export class RandomCommand extends Command {
  public readonly triggers = ["random"];
  public readonly numberOfParameters = 1;
  public readonly handlesDeletion = true;

  public async run(message: Message, params: string[]) {
    if (!message.member) return;

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      await message.reply(localize.t("helpers.voiceChannelFinder.error"));
      return;
    }

    const { queue } = message.client;
    const sounds =
      params.length === this.numberOfParameters ? soundsDb.withTag(params[0]) : getSounds();
    const random = sounds[Math.floor(Math.random() * sounds.length)];

    queue.add(new QueueItem(random, voiceChannel, message));
  }
}
