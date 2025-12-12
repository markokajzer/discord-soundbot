import localize from "~/util/i18n/localize";

import Command from "../Command";

export class ConfigCommand extends Command {
  public readonly triggers = ["config", "set"];
  public readonly numberOfParameters = 2;
  public readonly usage = "Usage: !config <option> <value>";
  public readonly elevated = true;

  public async run(message: Message, params: string[]) {
    if (params.length < this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const { config } = message.client;
    const [field, ...value] = params;

    if (!config.has(field)) {
      message.channel.send(localize.t("commands.config.notFound", { field }));
      return;
    }

    const configValue = config.set(field, value);
    this.postProcess(message, field);

    message.channel.send(
      localize.t("commands.config.success", { field, value: configValue.toString() })
    );
  }

  private postProcess(message: Message, field: string) {
    const { config, user } = message.client;

    switch (field) {
      case "game":
        user.setActivity(config.game);
        break;
      case "language":
        localize.setLocale(config.language);
        break;
      default:
        break;
    }
  }
}
