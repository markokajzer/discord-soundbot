import Discord from 'discord.js';
import './discord/Message';

import * as Commands from './commands/Commands';

import DatabaseAdapter from './db/DatabaseAdapter';
import SoundQueue from './queue/SoundQueue';

export default class MessageHandler {
  private readonly queue: SoundQueue;
  private readonly db: DatabaseAdapter;
  private readonly prefix: string;

  constructor(queue: SoundQueue, db: DatabaseAdapter, prefix: string) {
    this.queue = queue;
    this.db = db;
    this.prefix = prefix;
  }

  public handle(message: Discord.Message) {
    if (message.isDirectMessage()) return;
    if (!message.hasPrefix(this.prefix)) return;

    // @REVIEW Move this check to User.isIgnored?
    // Then user knows about db :/
    if (this.db.isIgnoredUser(message.author.id)) return;

    message.content = message.content.substring(this.prefix.length);
    this.handleMessage(message);
  }

  // @REVIEW Want to extract this to a CommandHandler class that maps trigger -> Command
  // How to handle different size of arguments between commands?
  // Always pass message, input, queue, db and ignore params that the command does not use?
  private handleMessage(message: Discord.Message) {
    const [command, ...input] = message.content.split(' ');
    switch (command) {
      case 'help':
      case 'commands':
        new Commands.Help(message).run();
        break;
      case 'sounds':
        new Commands.Sounds(message).run();
        break;
      case 'mostplayed':
        new Commands.MostPlayed(message, this.db).run();
        break;
      case 'lastadded':
        new Commands.LastAdded(message).run();
        break;
      case 'add':
        new Commands.Add(message).run();
        break;
      case 'rename':
        new Commands.Rename(message, input).run();
        break;
      case 'remove':
        new Commands.Remove(message, input).run();
        break;
      case 'search':
        new Commands.Search(message, input).run();
        break;
      case 'ignore':
        new Commands.Ignore(message, this.db, input).run();
        break;
      case 'unignore':
        new Commands.Unignore(message, this.db, input).run();
        break;
      case 'leave':
      case 'stop':
        new Commands.Stop(message, this.queue).run();
        break;
      case 'random':
        new Commands.Random(message, this.queue).run();
        break;
      default:
        new Commands.Sound(message, this.queue).run();
        break;
    }
  }
}
