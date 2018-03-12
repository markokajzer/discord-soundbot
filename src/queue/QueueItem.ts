import { Message, VoiceChannel } from 'discord.js';

export default class QueueItem {
  public sound: string;
  public channel: VoiceChannel;
  public message: Message;

  constructor(sound: string, channel: VoiceChannel, message: Message) {
    this.sound = sound;
    this.channel = channel;
    this.message = message;
  }
}
