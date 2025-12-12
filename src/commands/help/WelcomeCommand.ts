import localize from "~/util/i18n/localize";

import Command from "../Command";

export class WelcomeCommand extends Command {
  public readonly triggers = ["welcome"];

  public async run(message: Message) {
    const { config } = message.client;
    message.channel.send(localize.t("welcome", { prefix: config.prefix }));
  }
}
