import "../discord/Message";

import type { Message as DiscordMessage } from "discord.js";

import type Command from "~/commands/Command";
import userHasElevatedRole from "~/commands/util/userHasElevatedRole";
import * as ignoreList from "~/util/db/IgnoreList";
import localize from "~/util/i18n/localize";
import CommandCollection from "./CommandCollection";

export default class MessageHandler {
  private readonly commands = new CommandCollection();

  public handle(message: DiscordMessage) {
    if (!this.isValidMessage(message)) return;

    const { config } = message.client;
    const messageToHandle = message;
    messageToHandle.content = message.content.substring(config.prefix.length);

    this.execute(messageToHandle);
  }

  public registerCommands(commands: Command[]) {
    this.commands.registerCommands(commands);
  }

  private isValidMessage(message: DiscordMessage): message is Message {
    if (!message.channel.isSendable()) return false;
    if (message.author.bot) return false;
    if (message.isDirectMessage()) return false;

    const { config } = message.client;
    if (!message.hasPrefix(config.prefix)) return false;
    if (ignoreList.exists(message.author.id)) return false;

    return true;
  }

  private async execute(message: Message) {
    const [command, ...params] = message.content.split(" ");
    const commandToRun = this.commands.get(command);

    if (commandToRun.elevated && !userHasElevatedRole(message.member)) {
      message.channel.send(localize.t("errors.unauthorized"));
      return;
    }

    await commandToRun.run(message, params);

    const { config } = message.client;
    if (config.cleanup === "all" && message.deletable) message.delete();
  }
}
