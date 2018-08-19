import { ClientUser, Collection, Message } from 'discord.js';

import ICommand from './base/ICommand';

import * as Commands from './Commands';

export default class CommandCollection extends Collection<string, ICommand> {
  private readonly soundCommand: Commands.SoundCommand;

  constructor(commands: Array<ICommand>) {
    super();
    this.soundCommand = commands.find(command => !command.TRIGGERS.length)! as Commands.SoundCommand;
    this.registerCommands(commands);
  }

  public registerUserCommands(user: ClientUser) {
    this.registerTriggers(new Commands.AvatarCommand(user));
  }

  public execute(command: string, params: Array<string>, message: Message) {
    if (this.has(command)) {
      message.content = message.content.substring(command.length + 1);
      this.get(command)!.run(message, params);
      return;
    }

    this.soundCommand.run(message, params);
  }

  private registerCommands(commands: Array<ICommand>) {
    commands.forEach(command => this.registerTriggers(command));
  }

  private registerTriggers(command: ICommand) {
    command.TRIGGERS.forEach(trigger => this.set(trigger, command));
  }
}
