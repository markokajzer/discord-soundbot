import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import * as soundsDb from '~/util/db/Sounds';
import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class ShuffleCommand extends QueueCommand {
  public readonly triggers = ['shuffle'];
  public readonly numberOfParameters = 2;
  public readonly usage = 'Usage: !shuffle <count> <tag>';

  public run(message: Message, params: string[]) {
    if (!message.member) return;

    if (params.length > this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const [countAsString, tag] = params;
    const shuffleCount = parseInt(countAsString);
    if (shuffleCount < 1 || shuffleCount > 15) {
      message.reply(localize.t('helpers.shuffleCount.error'));
      return;
    }

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    const sounds = params.length === this.numberOfParameters ? soundsDb.withTag(tag) : getSounds();

    for (let counter = 0; counter < shuffleCount; counter += 1) {
      const random = sounds[Math.floor(Math.random() * sounds.length)];
      this.queue.add(new QueueItem(random, voiceChannel, message));
    }
  }
}
