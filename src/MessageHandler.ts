import Discord from 'discord.js';
import './discord/Message';

import * as Commands from './commands/Commands';
import SoundQueue from './queue/SoundQueue';
import Util from './Util';

export default class MessageHandler {
  private readonly prefix: string;
  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue, prefix: string) {
    this.queue = queue;
    this.prefix = prefix;
  }

  public handle(message: Discord.Message) {
    if (message.isDirectMessage()) return;
    if (!message.hasPrefix(this.prefix)) return;
    if (Util.isIgnoredUser(message.author)) return;

    message.content = message.content.substring(this.prefix.length);
    this.handleMessage(message);
  }

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
        new Commands.MostPlayed(message, Util.db).run();
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
      case 'ignore':
        new Commands.Ignore(message, Util.db, input).run();
        break;
      case 'unignore':
        new Commands.Unignore(message, Util.db, input).run();
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
