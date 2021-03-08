import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import localize from '~/util/i18n/localize';
import { existsSound } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class LoopCommand extends QueueCommand {
  public readonly triggers = ['loop', 'repeat'];
  public readonly numberOfParameters = 2;
  public readonly usage = 'Usage: !loop <sound> <count>';

  public async run(message: Message, params: string[]) {
    if (!message.reference!.guildID) return;

    if (params.length > this.numberOfParameters) {
      await message.edit(this.usage);
      return;
    }

    const [sound, countAsString] = params;
    if (!existsSound(sound)) {
      await message.edit(localize.t('errors.sounds.notFound', { sound }));
      return;
    }

    const originalMsg = await message.referencedMessage();
    const { channel: voiceChannel } = originalMsg.member!.voice;
    if (!voiceChannel) {
      await message.edit(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    const count = parseInt(countAsString) || Number.MAX_SAFE_INTEGER;
    const item = new QueueItem(sound, voiceChannel, message, count);

    this.queue.add(item);
  }
}
