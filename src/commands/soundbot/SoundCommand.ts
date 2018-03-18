import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

import QueueItem from '../../queue/QueueItem';
import SoundQueue from '../../queue/SoundQueue';
import SoundUtil from '../../util/SoundUtil';
import VoiceChannelFinder from '../helpers/VoiceChannelFinder';

export default class SoundCommand implements ICommand {
  public readonly TRIGGERS = [];
  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message, _: Array<string>, voiceChannelFinder = new VoiceChannelFinder()) {
    const voiceChannel = voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    const sound = message.content;
    if (!SoundUtil.soundExists(sound)) return;

    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
