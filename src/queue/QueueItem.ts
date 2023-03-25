import { Message, VoiceBasedChannel } from 'discord.js';

export default class QueueItem {
  public readonly name: string;
  public readonly channel: VoiceBasedChannel;
  public readonly message?: Message;
  public count: number;

  constructor(name: string, channel: VoiceBasedChannel, message?: Message, count = 1) {
    this.name = name;
    this.channel = channel;
    this.message = message;
    this.count = count;
  }
}
