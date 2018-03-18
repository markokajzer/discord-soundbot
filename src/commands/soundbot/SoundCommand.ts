import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import QueueItem from '../../queue/QueueItem';
import SoundQueue from '../../queue/SoundQueue';
import SoundUtil from '../../util/SoundUtil';

export default class SoundCommand extends BaseCommand {
  public readonly TRIGGERS = [];
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

    const sound = message.content;
    if (!SoundUtil.soundExists(sound)) return;

    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
