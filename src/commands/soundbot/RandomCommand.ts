import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

import QueueItem from '../../queue/QueueItem';
import SoundQueue from '../../queue/SoundQueue';
import SoundUtil from '../../util/SoundUtil';
import VoiceChannelFinder from '../helpers/VoiceChannelFinder';

export default class RandomCommand implements ICommand {
  public readonly TRIGGERS = ['random'];
  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message, _: Array<string>, voiceChannelFinder = new VoiceChannelFinder()) {
    const voiceChannel = voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    const sounds = SoundUtil.getSounds();
    const random = sounds[Math.floor(Math.random() * sounds.length)];

    this.queue.add(new QueueItem(random, voiceChannel, message));
  }
}
