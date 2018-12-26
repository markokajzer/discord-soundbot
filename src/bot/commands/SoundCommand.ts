import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import QueueItem from '@util/queue/QueueItem';
import SoundQueue from '@util/queue/SoundQueue';
import SoundUtil from '@util/SoundUtil';
import VoiceChannelFinder from './helpers/VoiceChannelFinder';

export default class SoundCommand implements ICommand {
  public readonly TRIGGERS = [];

  private readonly soundUtil: SoundUtil;
  private readonly queue: SoundQueue;
  private readonly voiceChannelFinder: VoiceChannelFinder;

  constructor(soundUtil: SoundUtil, queue: SoundQueue, voiceChannelFinder: VoiceChannelFinder) {
    this.soundUtil = soundUtil;
    this.queue = queue;
    this.voiceChannelFinder = voiceChannelFinder;
  }

  public run(message: Message, _: Array<string>) {
    const sound = message.content;
    if (!this.soundUtil.soundExists(sound)) return;

    const voiceChannel = this.voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    this.soundUtil.randomLoop = true;
    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
