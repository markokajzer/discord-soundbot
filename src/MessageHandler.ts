import config from '../config/config.json';

import Discord from 'discord.js';
import './discord/Message';

import Util from './Util';

export default class MessageHandler {
  private prefix: string;
  private speaking: boolean;
  private queue: Array<{ name: string, channel: Discord.VoiceChannel, message: Discord.Message }>;

  constructor(prefix: string) {
    this.prefix = prefix;
    this.speaking = false;
    this.queue = [];
  }

  public handle(message: Discord.Message) {
    if (message.isDirectMessage()) return;
    if (!message.hasPrefix(this.prefix)) return;
    if (Util.userIgnored(message.author)) return;

    message.content = message.content.substring(this.prefix.length);
    this.handleMessage(message);
  }

  private handleMessage(message: Discord.Message) {
    const [command, ...input] = message.content.split(' ');
    switch (command) {
      case 'commands':
        message.author.send(Util.getListOfCommands());
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
      default:
        this.handleSoundCommands(message);
        break;
    }
  }

  private handleSoundCommands(message: Discord.Message) {
    const sounds = Util.getSounds();
    const voiceChannel = message.member.voiceChannel;

    if (!voiceChannel) {
      message.reply('Join a voice channel first!');
      return;
    }

    switch (message.content) {
      case 'leave':
      case 'stop':
        voiceChannel.leave();
        this.queue = [];
        break;
      case 'random':
        const random = sounds[Math.floor(Math.random() * sounds.length)];
        this.addToQueue(random, voiceChannel, message);
        break;
      default:
        const sound = message.content;
        if (sounds.includes(sound)) {
          this.addToQueue(sound, voiceChannel, message);
          if (!this.speaking) this.playSoundQueue();
        }
        break;
    }
  }

  private addToQueue(sound: string, voiceChannel: Discord.VoiceChannel, message: Discord.Message) {
    this.queue.push({ name: sound, channel: voiceChannel, message: message });
  }

  private playSoundQueue() {
    const nextSound = this.queue.shift()!;
    const file = Util.getPathForSound(nextSound.name);
    const voiceChannel = nextSound.channel;

    this.speaking = true;

    voiceChannel.join().then(connection => {
      connection.playFile(file).on('end', () => {
        Util.updateCount(nextSound.name);
        if (config.deleteMessages) nextSound.message.delete();

        if (this.queue.length === 0) {
          this.speaking = false;
          if (!config.stayInChannel) connection.disconnect();
          return;
        }

        this.playSoundQueue();
      });
    }).catch(error => {
      console.log('Error occured!');  // tslint:disable-line no-console
      console.log(error);             // tslint:disable-line no-console
    });
  }
}
