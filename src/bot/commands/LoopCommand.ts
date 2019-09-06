import { Message } from 'discord.js';

import SoundQueue from '@queue/SoundQueue';
import QueueItem from '@queue/QueueItem';
import localize from '@util/i18n/localize';
import { existsSound } from '@util/SoundUtil';
import Command from './base/Command';

export default class LoopCommand implements Command {
  public readonly TRIGGERS = ['loop', 'repeat'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !loop <sound> <count>';

  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message, params: string[]) {
    if (params.length > this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const [sound, countAsString] = params;
    if (!existsSound(sound)) return;

    const { voiceChannel } = message.member;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    const count = parseInt(countAsString);
    this.queue.add(new QueueItem(sound, voiceChannel, message, count || Number.MAX_SAFE_INTEGER));
  }
}
