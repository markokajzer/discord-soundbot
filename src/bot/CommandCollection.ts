import { ClientUser, Collection, Message } from 'discord.js';

import Command from './commands/base/Command';
import UserCommand from './commands/base/UserCommand';
import SoundCommand from './commands/SoundCommand';

export default class CommandCollection extends Collection<string, Command> {
  private readonly commands: Array<Command>;
  private readonly soundCommand: SoundCommand;

  constructor(commands: Array<Command>) {
    super();
    this.commands = commands;
    this.soundCommand = commands.find(command => !command.TRIGGERS.length)! as SoundCommand;
    this.registerCommands(commands);
  }

  public registerUserCommands(user: ClientUser) {
    const userCommands = this.commands.filter(command => (command as UserCommand).setClientUser);
    (userCommands as Array<UserCommand>).forEach(command => command.setClientUser(user));
    this.registerCommands(userCommands);
  }

  public execute(command: string, params: Array<string>, message: Message) {
    if (this.has(command)) {
      message.content = message.content.substring(command.length + 1);
      this.get(command)!.run(message, params);
      return;
    }

    this.soundCommand.run(message, params);
  }

  private registerCommands(commands: Array<Command>) {
    commands.forEach(command => this.registerTriggers(command));
  }

  private registerTriggers(command: Command) {
    command.TRIGGERS.forEach(trigger => this.set(trigger, command));
  }
}
