import { Message, VoiceChannel } from 'discord.js';

export default class QueueItem {
  public readonly sound: string;
  public readonly channel: VoiceChannel;
  public readonly message: Message;

  constructor(sound: string, channel: VoiceChannel, message: Message) {
    this.sound = sound;
    this.channel = channel;
    this.message = message;
  }
}
