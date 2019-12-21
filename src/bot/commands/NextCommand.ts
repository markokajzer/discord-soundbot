import { Message } from 'discord.js';

import SoundQueue from '@queue/SoundQueue';
import QueueItem from '@queue/QueueItem';
import localize from '@util/i18n/localize';
import { existsSound } from '@util/SoundUtil';
import Command from './base/Command';

export default class NextCommand implements Command {
  public readonly TRIGGERS = ['next'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = '!next <sound>';

  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message, params: string[]) {
    if (!message.member) return;

    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const [sound] = params;
    if (!existsSound(sound)) return;

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    this.queue.addBefore(new QueueItem(sound, voiceChannel, message));
    this.queue.next();
  }
}
