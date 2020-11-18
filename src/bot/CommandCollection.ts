import { ClientUser } from 'discord.js';

import Command from '../commands/base/Command';
import UserCommand from '../commands/base/UserCommand';
import { SoundCommand } from '../commands/sound';

export default class CommandCollection {
  private readonly triggers: Map<string, Command> = new Map();
  private readonly commands: Command[] = [];
  private readonly soundCommand: SoundCommand;

  constructor(commands: Command[]) {
    this.soundCommand = commands.find(command => !command.triggers.length) as SoundCommand;

    this.registerCommands(commands);
  }

  public registerCommands(commands: Command[]) {
    this.commands.push(...commands);
    commands.forEach(command => this.registerTriggers(command));
  }

  public registerUserCommands(user: ClientUser) {
    // NOTE: Filter for user commands and set their user
    // @ts-ignore
    const userCommands: UserCommand[] = this.commands.filter(command => !!command.setClientUser);
    userCommands.forEach(command => command.setClientUser(user));
  }

  public get(command: string) {
    return this.triggers.get(command) || this.soundCommand;
  }

  private registerTriggers(command: Command) {
    command.triggers.forEach(trigger => this.triggers.set(trigger, command));
  }
}
