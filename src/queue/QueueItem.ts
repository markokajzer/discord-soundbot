import { Message, VoiceChannel } from 'discord.js';

export default class QueueItem {
  public readonly name: string;
  public readonly channel: VoiceChannel;
  public readonly message?: Message;
  public count: number;

  constructor(name: string, channel: VoiceChannel, message?: Message, count = 1) {
    this.name = name;
    this.channel = channel;
    this.message = message;
    this.count = count;
  }
}
