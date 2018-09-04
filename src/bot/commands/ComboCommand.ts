import { Message, VoiceChannel } from 'discord.js';

import ICommand from './base/ICommand';

import QueueItem from '@util/queue/QueueItem';
import SoundQueue from '@util/queue/SoundQueue';
import SoundUtil from '@util/SoundUtil';
import VoiceChannelFinder from './helpers/VoiceChannelFinder';

export default class ComboCommand implements ICommand {
  public readonly TRIGGERS = ['combo'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !combo <sound1> ... <soundN>';

  private readonly soundUtil: SoundUtil;
  private readonly queue: SoundQueue;
  private readonly voiceChannelFinder: VoiceChannelFinder;
  private sounds!: Array<string>;

  constructor(soundUtil: SoundUtil, queue: SoundQueue, voiceChannelFinder: VoiceChannelFinder) {
    this.soundUtil = soundUtil;
    this.queue = queue;
    this.voiceChannelFinder = voiceChannelFinder;
  }

  public run(message: Message, params: Array<string>) {
    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const voiceChannel = this.voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    this.sounds = this.soundUtil.getSounds();
    this.addSoundsToQueue(params, voiceChannel, message);
  }

  private addSoundsToQueue(sounds: Array<string>, voiceChannel: VoiceChannel, message: Message) {
    sounds.forEach((sound, index) => {
      if (!this.sounds.includes(sound)) return;

      if (index === sounds.length - 1) {
        this.queue.add(new QueueItem(sound, voiceChannel, message));
        return;
      }

      this.queue.add(new QueueItem(sound, voiceChannel));
    });
  }
}
