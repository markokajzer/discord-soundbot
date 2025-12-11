import "../discord/Message";

import type { Message as DiscordMessage } from "discord.js";

import userHasElevatedRole from "~/commands/util/userHasElevatedRole";
import { config } from "~/util/Container";
import * as ignoreList from "~/util/db/IgnoreList";
import localize from "~/util/i18n/localize";
import type CommandCollection from "./CommandCollection";

export default class MessageHandler {
  private readonly commands: CommandCollection;

  constructor(commands: CommandCollection) {
    this.commands = commands;
  }

  public handle(message: DiscordMessage) {
    if (!this.isValidMessage(message)) return;

    const messageToHandle = message;
    messageToHandle.content = message.content.substring(config.prefix.length);

    this.execute(messageToHandle);
  }

  private isValidMessage(message: DiscordMessage): message is Message {
    if (!message.channel.isSendable()) return false;
    if (message.author.bot) return false;
    if (message.isDirectMessage()) return false;
    if (!message.hasPrefix(config.prefix)) return false;
    if (ignoreList.exists(message.author.id)) return false;

    return true;
  }

  private execute(message: Message) {
    const [command, ...params] = message.content.split(" ");
    const commandToRun = this.commands.get(command);

    if (commandToRun.elevated && !userHasElevatedRole(message.member)) {
      message.channel.send(localize.t("errors.unauthorized"));
      return;
    }

    commandToRun.run(message, params);
  }
}
