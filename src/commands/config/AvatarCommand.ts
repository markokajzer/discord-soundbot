import localize from "~/util/i18n/localize";

import Command from "../Command";

export class AvatarCommand extends Command {
  public readonly triggers = ["avatar"];
  public readonly numberOfParameters = 1;
  public readonly usage = "Usage: !avatar [remove]";
  public readonly elevated = true;

  public async run(message: Message, params: string[]) {
    const { user } = message.client;

    if (params.length === this.numberOfParameters && params[0] === "remove") {
      user.setAvatar("");
      return;
    }

    if (message.attachments.size === 0) {
      this.listAvatar(message);
      return;
    }

    if (message.attachments.size !== 1) {
      message.channel.send(this.usage);
      return;
    }

    // biome-ignore lint/style/noNonNullAssertion: ensured exactly one attachment above
    user.setAvatar(message.attachments.first()!.url).catch(() => {
      message.channel.send(localize.t("commands.avatar.errors.tooFast"));
    });
  }

  private listAvatar(message: Message) {
    const { config, user } = message.client;

    if (!user.avatarURL()) {
      message.channel.send(
        localize.t("commands.avatar.errors.noAvatar", { prefix: config.prefix })
      );
      return;
    }

    message.channel.send(
      localize.t("commands.avatar.url", {
        url: user.displayAvatarURL({ size: 256 }),
      })
    );
  }
}
