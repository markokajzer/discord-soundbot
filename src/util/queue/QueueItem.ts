import { Message, VoiceChannel } from 'discord.js';

export default class QueueItem {
  public readonly name: string;
  public readonly channel: VoiceChannel;
  public readonly message: Message;

  constructor(name: string, channel: VoiceChannel, message: Message) {
    this.name = name;
    this.channel = channel;
    this.message = message;
  }
}
