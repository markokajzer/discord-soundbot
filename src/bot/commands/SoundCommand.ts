import { Message } from 'discord.js';

import Command from './base/Command';

import QueueItem from '@util/queue/QueueItem';
import SoundQueue from '@util/queue/SoundQueue';
import SoundUtil from '@util/SoundUtil';
import VoiceChannelFinder from './helpers/VoiceChannelFinder';

export default class SoundCommand implements Command {
  public readonly TRIGGERS = [];

  private readonly soundUtil: SoundUtil;
  private readonly queue: SoundQueue;
  private readonly voiceChannelFinder: VoiceChannelFinder;

  constructor(soundUtil: SoundUtil, queue: SoundQueue, voiceChannelFinder: VoiceChannelFinder) {
    this.soundUtil = soundUtil;
    this.queue = queue;
    this.voiceChannelFinder = voiceChannelFinder;
  }

  public run(message: Message, _: string[]) {
    const sound = message.content;
    if (!this.soundUtil.soundExists(sound)) return;

    const voiceChannel = this.voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
