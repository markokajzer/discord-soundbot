import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import QueueItem from '../../queue/QueueItem';
import SoundQueue from '../../queue/SoundQueue';
import SoundUtil from '../../util/SoundUtil';
import VoiceChannelFinder from '../helpers/VoiceChannelFinder';

export default class SoundCommand implements ICommand {
  public readonly TRIGGERS = [];
  private readonly queue: SoundQueue;
  private readonly voiceChannelFinder: VoiceChannelFinder;

  constructor(queue: SoundQueue, voiceChannelFinder: VoiceChannelFinder) {
    this.queue = queue;
    this.voiceChannelFinder = voiceChannelFinder;
  }

  public run(message: Message, _: Array<string>) {
    const sound = message.content;
    if (!SoundUtil.soundExists(sound)) return;

    const voiceChannel = this.voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
