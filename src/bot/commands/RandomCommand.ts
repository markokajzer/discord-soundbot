import { Message } from 'discord.js';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import * as soundsDb from '@util/db/Sounds';
import localize from '@util/i18n/localize';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class RandomCommand implements Command {
  public readonly TRIGGERS = ['random'];
  public readonly NUMBER_OF_PARAMETERS = 1;

  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message, params: string[]) {
    if (!message.member) return;

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    const sounds =
      params.length === this.NUMBER_OF_PARAMETERS ? soundsDb.withTag(params[0]) : getSounds();

    const random = sounds[Math.floor(Math.random() * sounds.length)];
    this.queue.add(new QueueItem(random, voiceChannel, message));
  }
}
