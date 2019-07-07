import { Message, VoiceChannel } from 'discord.js';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';
import getVoiceChannelFromMessageAuthor from './helpers/getVoiceChannelFromMessageAuthor';

export default class ComboCommand implements Command {
  public readonly TRIGGERS = ['combo'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !combo <sound1> ... <soundN>';

  private readonly queue: SoundQueue;
  private sounds!: string[];

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message, params: string[]) {
    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const voiceChannel = getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    this.sounds = getSounds();
    this.addSoundsToQueue(params, voiceChannel, message);
  }

  private addSoundsToQueue(sounds: string[], voiceChannel: VoiceChannel, message: Message) {
    sounds.forEach(sound => this.addSoundToQueue(sound, voiceChannel, message));
  }

  private addSoundToQueue(sound: string, voiceChannel: VoiceChannel, message: Message) {
    if (!this.sounds.includes(sound)) return;
    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
