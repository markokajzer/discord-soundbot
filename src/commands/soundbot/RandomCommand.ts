import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import QueueItem from '../../queue/QueueItem';
import SoundQueue from '../../queue/SoundQueue';
import SoundUtil from '../../util/SoundUtil';

export default class RandomCommand extends BaseCommand {
  public readonly TRIGGERS = ['random'];
  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    super();
    this.queue = queue;
  }

  public run(message: Message) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      message.reply('Join a voice channel first!');
      return;
    }

    const sounds = SoundUtil.getSounds();
    const random = sounds[Math.floor(Math.random() * sounds.length)];

    this.queue.add(new QueueItem(random, voiceChannel, message));
  }
}
