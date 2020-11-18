import { ClientUser, Message } from 'discord.js';

import userHasElevatedRole from '~/commands/util/userHasElevatedRole';
import localize from '~/util/i18n/localize';

import Command from '../commands/base/Command';
import UserCommand from '../commands/base/UserCommand';
import { SoundCommand } from '../commands/sound';

export default class CommandCollection {
  private readonly triggers: Map<string, Command>;
  private readonly commands: Command[];
  private readonly soundCommand: SoundCommand;

  constructor(commands: Command[]) {
    this.triggers = new Map();
    this.commands = [];
    this.soundCommand = commands.find(command => !command.triggers.length) as SoundCommand;

    this.registerCommands(commands);
  }

  public registerCommands(commands: Command[]) {
    this.commands.push(...commands);
    commands.forEach(command => this.registerTriggers(command));
  }

  public registerUserCommands(user: ClientUser) {
    // NOTE: Filter for user commands and set their user
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userCommands: UserCommand[] = this.commands.filter(command => !!command.setClientUser);
    userCommands.forEach(command => command.setClientUser(user));
  }

  // TODO: Move this to MessageHandler
  public execute(message: Message) {
    const [command, ...params] = message.content.split(' ');

    const commandToRun = this.triggers.get(command) || this.soundCommand;
    if (commandToRun.elevated && !userHasElevatedRole(message.member)) {
      message.channel.send(localize.t('errors.unauthorized'));
      return;
    }

    commandToRun.run(message, params);
  }

  private registerTriggers(command: Command) {
    command.triggers.forEach(trigger => this.triggers.set(trigger, command));
  }
}
