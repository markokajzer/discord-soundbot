import Discord from 'discord.js';
import './discord/Message';

import QueueItem from './queue/QueueItem';
import SoundQueue from './queue/SoundQueue';

import * as Commands from './commands/Commands';

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
      case 'commands':
        new Commands.CommandList(message).run();
        break;
      case 'sounds':
        message.author.send(Util.getSounds().map(sound => sound));
        break;
      case 'mostplayed':
        message.channel.send(Util.getMostPlayedSounds());
        break;
      case 'lastadded':
        message.channel.send(['```', ...Util.getLastAddedSounds(), '```'].join('\n'));
        break;
      case 'add':
        Util.addSounds(message);
        break;
      case 'rename':
        Util.renameSound(message, input);
        break;
      case 'remove':
        Util.removeSound(message, input);
        break;
      case 'ignore':
        Util.ignoreUser(message, input);
        break;
      case 'unignore':
        Util.unignoreUser(message, input);
        break;
      case 'leave':
      case 'stop':
        const current = this.queue.getCurrent();
        this.queue.clear();
        if (current) current.channel.leave();
        break;
      default:
        this.handleSoundCommands(message);
        break;
    }
  }

  private handleSoundCommands(message: Discord.Message) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      message.reply('Join a voice channel first!');
      return;
    }

    const sounds = Util.getSounds();
    let sound: string;
    switch (message.content) {
      case 'random':
        sound = sounds[Math.floor(Math.random() * sounds.length)];
        break;
      default:
        sound = message.content;
        if (!sounds.includes(sound)) return;
        break;
    }

    this.queue.add(new QueueItem(sound, voiceChannel, message));
    this.queue.start();
  }
}
