import localize from "~/util/i18n/localize";
import { getSounds } from "~/util/SoundUtil";

import ConfigCommand from "../base/ConfigCommand";
import chunkedMessages from "../util/chunkedMessages";

export class SoundsCommand extends ConfigCommand {
  public readonly triggers = ["sounds"];

  public async run(message: Message, params: string[]) {
    const sounds = getSounds();

    if (!sounds.length) {
      message.author.send(localize.t("commands.sounds.notFound", { prefix: this.config.prefix }));
      return;
    }

    const page = Number.parseInt(params[0], 10);
    chunkedMessages(sounds, page).forEach((chunk) => message.author.send(chunk));
  }
}
