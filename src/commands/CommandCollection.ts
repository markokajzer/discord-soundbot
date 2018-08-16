import { ClientUser, Collection, Message } from 'discord.js';

import DatabaseAdapter from '../db/DatabaseAdapter';
import SoundQueue from '../queue/SoundQueue';

import ICommand from './base/ICommand';

import * as Commands from './Commands';

export default class CommandCollection extends Collection<string, ICommand> {
  private readonly soundCommand: Commands.SoundCommand;

  constructor(db = new DatabaseAdapter(), queue = new SoundQueue(db)) {
    super();
    this.soundCommand = new Commands.SoundCommand(queue);
    this.initializeCommands(db, queue);
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

  private initializeCommands(db: DatabaseAdapter, queue: SoundQueue) {
    [
      new Commands.AddCommand(),
      new Commands.RenameCommand(db),
      new Commands.RemoveCommand(db),

      new Commands.RandomCommand(queue),

      new Commands.SoundsCommand(),
      new Commands.SearchCommand(db),
      new Commands.TagCommand(db),
      new Commands.TagsCommand(db),
      new Commands.DownloadCommand(),

      new Commands.StopCommand(queue),

      new Commands.HelpCommand(),
      new Commands.LastAddedCommand(),
      new Commands.MostPlayedCommand(db),

      new Commands.IgnoreCommand(db),
      new Commands.UnignoreCommand(db)
    ].forEach(command => this.registerTriggers(command));
  }

  private registerTriggers(command: ICommand) {
    command.TRIGGERS.forEach(trigger => this.set(trigger, command));
  }
}
