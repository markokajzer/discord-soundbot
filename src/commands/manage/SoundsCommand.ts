import localize from "~/util/i18n/localize";
import { getSounds } from "~/util/SoundUtil";

import Command from "../Command";
import chunkedMessages from "../util/chunkedMessages";

export class SoundsCommand extends Command {
  public readonly triggers = ["sounds"];

  public async run(message: Message, params: string[]) {
    const sounds = getSounds();

    if (!sounds.length) {
      const { config } = message.client;
      message.author.send(localize.t("commands.sounds.notFound", { prefix: config.prefix }));
      return;
    }

    const page = Number.parseInt(params[0]);
    chunkedMessages(sounds, page).forEach((chunk) => message.author.send(chunk));
  }
}
