import '../discord/Message';

import { Message } from 'discord.js';

import userHasElevatedRole from '~/commands/util/userHasElevatedRole';
import { config } from '~/util/Container';
import * as ignoreList from '~/util/db/IgnoreList';
import localize from '~/util/i18n/localize';

import CommandCollection from './CommandCollection';

export default class MessageHandler {
  private readonly commands: CommandCollection;

  constructor(commands: CommandCollection) {
    this.commands = commands;
  }

  public async handle(message: Message) {
    if (!MessageHandler.isValidMessage(message)) return;

    const messageToHandle = message;
    messageToHandle.content = message.content.substring(config.prefix.length);

    await this.execute(messageToHandle);
  }

  private static isValidMessage(message: Message) {
    return (
      !message.author.bot &&
      !message.isDirectMessage() &&
      message.hasPrefix(config.prefix) &&
      !ignoreList.exists(message.author.id)
    );
  }

  private async execute(message: Message) {
    const [command, ...params] = message.content.split(' ');
    const commandToRun = this.commands.get(command);

    if (commandToRun.elevated && !userHasElevatedRole(message.member)) {
      await message.channel.send(localize.t('errors.unauthorized'));
      return;
    }

    const statusMsg = await message.reply(localize.t('status.received', { command }));
    statusMsg.reference = {
      // This should really be done by the discordjs library since we are replying
      channelID: message.channel.id,
      guildID: message.guild?.id || '',
      messageID: message.id
    };

    try {
      await commandToRun.run(statusMsg, params);

      if (statusMsg.editedAt === null) {
        // If we haven't reported any status
        await statusMsg.edit(localize.t('status.completed', { command }));
      }
    } catch (e) {
      console.error(e);
      await statusMsg.edit(localize.t('errors.unspecific'));
    }
  }
}
