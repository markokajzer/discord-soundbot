import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import * as soundsDb from '~/util/db/Sounds';
import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class RandomCommand extends QueueCommand {
  public readonly triggers = ['random'];
  public readonly numberOfParameters = 1;

  public run(message: Message, params: string[]) {
    if (!message.member) return;

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    const sounds =
      params.length === this.numberOfParameters ? soundsDb.withTag(params[0]) : getSounds();

    const random = sounds[Math.floor(Math.random() * sounds.length)];
    this.queue.add(new QueueItem(random, voiceChannel, message));
  }
}
