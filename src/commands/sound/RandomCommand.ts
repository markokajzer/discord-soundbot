import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import * as soundsDb from '~/util/db/Sounds';
import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class RandomCommand extends QueueCommand {
  public readonly triggers = ['random'];
  public readonly numberOfParameters = 1;

  public async run(message: Message, params: string[]) {
    if (!message.reference!.guildID) return;

    const originalMsg = await message.referencedMessage();
    const { channel: voiceChannel } = originalMsg.member!.voice;
    if (!voiceChannel) {
      await message.edit(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    const sounds =
      params.length === this.numberOfParameters ? soundsDb.withTag(params[0]) : getSounds();

    const random = sounds[Math.floor(Math.random() * sounds.length)];
    this.queue.add(new QueueItem(random, voiceChannel, message));
  }
}
