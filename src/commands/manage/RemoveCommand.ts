import fs from "node:fs";

import * as sounds from "~/util/db/Sounds";
import localize from "~/util/i18n/localize";
import { existsSound, getPathForSound } from "~/util/SoundUtil";

import Command from "../base/Command";

export class RemoveCommand extends Command {
  public readonly triggers = ["remove"];
  public readonly numberOfParameters = 1;
  public readonly usage = "Usage: !remove <sound>";
  public readonly elevated = true;

  public async run(message: Message, params: string[]) {
    if (params.length !== this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    // biome-ignore lint/style/noNonNullAssertion: verified params above
    const sound = params.shift()!;
    if (!existsSound(sound)) {
      message.channel.send(localize.t("commands.remove.notFound", { sound }));
      return;
    }

    const file = getPathForSound(sound);
    fs.unlinkSync(file);
    sounds.remove(sound);

    message.channel.send(localize.t("commands.remove.success", { sound }));
  }
}
