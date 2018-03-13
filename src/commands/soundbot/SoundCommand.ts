import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundQueue from '../../queue/SoundQueue';
import QueueItem from '../../queue/QueueItem';
import SoundUtil from '../../util/SoundUtil';

export class SoundCommand extends BaseCommand {
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

    const sound = this.message.content;
    if (!SoundUtil.soundExists(sound)) return;

    this.queue.add(new QueueItem(sound, voiceChannel, this.message));
  }
}
