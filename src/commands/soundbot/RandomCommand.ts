import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundQueue from '../../queue/SoundQueue';
import QueueItem from '../../queue/QueueItem';
import SoundUtil from '../../util/SoundUtil';

export class RandomCommand extends BaseCommand {
  private readonly queue: SoundQueue;

  constructor(message: Message, queue: SoundQueue) {
    super(message);
    this.queue = queue;
  }

  public run() {
    const voiceChannel = this.message.member.voiceChannel;
    if (!voiceChannel) {
      this.message.reply('Join a voice channel first!');
      return;
    }

    const sounds = SoundUtil.getSounds();
    const random = sounds[Math.floor(Math.random() * sounds.length)];

    this.queue.add(new QueueItem(random, voiceChannel, this.message));
  }
}
