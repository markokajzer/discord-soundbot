import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class ComboCommand extends QueueCommand {
  public readonly triggers = ['combo'];
  public readonly numberOfParameters = 1;
  public readonly usage = 'Usage: !combo <sound1> ... <soundN>';

  public async run(message: Message, params: string[]) {
    if (!message.reference!.guildID) return;

    if (params.length < this.numberOfParameters) {
      await message.edit(this.usage);
      return;
    }

    const originalMsg = await message.referencedMessage();
    const { channel: voiceChannel } = originalMsg.member!.voice;
    if (!voiceChannel) {
      await message.edit(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    const sounds = getSounds();

    params.forEach(sound => {
      if (!sounds.includes(sound)) return;

      const item = new QueueItem(sound, voiceChannel, message);
      this.queue.add(item);
    });
  }
}
