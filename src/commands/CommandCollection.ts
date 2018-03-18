import { Collection, Message } from 'discord.js';

import DatabaseAdapter from '../db/DatabaseAdapter';
import SoundQueue from '../queue/SoundQueue';

import BaseCommand from './base/BaseCommand';
import ICommand from './base/ICommand';

import AddCommand from './soundbot/AddCommand';
import RenameCommand from './soundbot/RenameCommand';
import RemoveCommand from './soundbot/RemoveCommand';

import RandomCommand from './soundbot/RandomCommand';
import SoundCommand from './soundbot/SoundCommand';

import SoundsCommand from './soundbot/SoundsCommand';
import SearchCommand from './soundbot/SearchCommand';

import StopCommand from './soundbot/StopCommand';

import HelpCommand from './soundbot/HelpCommand';
import LastAddedCommand from './soundbot/LastAddedCommand';
import MostPlayedCommand from './soundbot/MostPlayedCommand';

import IgnoreCommand from './soundbot/IgnoreCommand';
import UnignoreCommand from './soundbot/UnignoreCommand';

export default class CommandCollection extends Collection<string, ICommand> {
  private readonly soundCommand: SoundCommand;

  constructor(db = new DatabaseAdapter(), queue = new SoundQueue()) {
    super();
    this.soundCommand = new SoundCommand(queue);
    this.initializeCommands(queue, db);
  }

  public execute(command: string, message: Message) {
    if (this.has(command)) {
      message.content = message.content.substring(command.length + 1);
      this.get(command)!.run(message);
      return;
    }

    this.soundCommand.run(message);
  }

  private initializeCommands(queue: SoundQueue, db: DatabaseAdapter) {
    [
      new AddCommand(),
      new RenameCommand(),
      new RemoveCommand(),

      new RandomCommand(queue),

      new SoundsCommand(),
      new SearchCommand(),

      new StopCommand(queue),

      new HelpCommand(),
      new LastAddedCommand(),
      new MostPlayedCommand(db),

      new IgnoreCommand(db),
      new UnignoreCommand(db)
    ].forEach(command => this.registerTriggers(command));
  }

  private registerTriggers(command: BaseCommand) {
    command.TRIGGERS.forEach(trigger => this.set(trigger, command));
  }
}
