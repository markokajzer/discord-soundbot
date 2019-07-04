import { Message } from 'discord.js';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import { existsSound } from '@util/SoundUtil';
import Command from './base/Command';
import VoiceChannelFinder from './helpers/VoiceChannelFinder';

export default class SoundCommand implements Command {
  public readonly TRIGGERS = [];

  private readonly queue: SoundQueue;
  private readonly voiceChannelFinder: VoiceChannelFinder;

  constructor(queue: SoundQueue, voiceChannelFinder: VoiceChannelFinder) {
    this.queue = queue;
    this.voiceChannelFinder = voiceChannelFinder;
  }

  public run(message: Message) {
    const sound = message.content;
    if (!existsSound(sound)) return;

    const voiceChannel = this.voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
