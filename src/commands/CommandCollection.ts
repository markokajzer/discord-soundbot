import { ClientUser, Collection, Message } from 'discord.js';

import DatabaseAdapter from '../db/DatabaseAdapter';
import SoundQueue from '../queue/SoundQueue';

import ICommand from './base/ICommand';

// tslint:disable ordered-imports
import AddCommand from './soundbot/AddCommand';
import RenameCommand from './soundbot/RenameCommand';
import RemoveCommand from './soundbot/RemoveCommand';

import RandomCommand from './soundbot/RandomCommand';
import SoundCommand from './soundbot/SoundCommand';

import SoundsCommand from './soundbot/SoundsCommand';
import SearchCommand from './soundbot/SearchCommand';
import TagCommand from './soundbot/TagCommand';

import StopCommand from './soundbot/StopCommand';

import HelpCommand from './soundbot/HelpCommand';
import LastAddedCommand from './soundbot/LastAddedCommand';
import MostPlayedCommand from './soundbot/MostPlayedCommand';

import IgnoreCommand from './soundbot/IgnoreCommand';
import UnignoreCommand from './soundbot/UnignoreCommand';

import AvatarCommand from './soundbot/AvatarCommand';

export default class CommandCollection extends Collection<string, ICommand> {
  private readonly soundCommand: SoundCommand;

  constructor(queue = new SoundQueue(), db = new DatabaseAdapter()) {
    super();
    this.soundCommand = new SoundCommand(queue);
    this.initializeCommands(queue, db);
  }

  public registerUserCommands(user: ClientUser) {
    this.registerTriggers(new AvatarCommand(user));
  }

  public execute(command: string, params: Array<string>, message: Message) {
    if (this.has(command)) {
      message.content = message.content.substring(command.length + 1);
      this.get(command)!.run(message, params);
      return;
    }

    this.soundCommand.run(message, params);
  }

  private initializeCommands(queue: SoundQueue, db: DatabaseAdapter) {
    [
      new AddCommand(),
      new RenameCommand(db),
      new RemoveCommand(db),

      new RandomCommand(queue),

      new SoundsCommand(),
      new SearchCommand(db),
      new TagCommand(db),

      new StopCommand(queue),

      new HelpCommand(),
      new LastAddedCommand(),
      new MostPlayedCommand(db),

      new IgnoreCommand(db),
      new UnignoreCommand(db)
    ].forEach(command => this.registerTriggers(command));
  }

  private registerTriggers(command: ICommand) {
    command.TRIGGERS.forEach(trigger => this.set(trigger, command));
  }
}
