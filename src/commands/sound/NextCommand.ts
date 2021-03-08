import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import localize from '~/util/i18n/localize';
import { existsSound } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class NextCommand extends QueueCommand {
  public readonly triggers = ['next'];
  public readonly numberOfParameters = 1;
  public readonly usage = '!next <sound>';

  public async run(message: Message, params: string[]) {
    if (!message.reference!.guildID) return;

    if (params.length !== this.numberOfParameters) {
      await message.edit(this.usage);
      return;
    }

    const [sound] = params;
    if (!existsSound(sound)) {
      await message.edit(localize.t('commands.tag.notFound', { sound }));
      return;
    }

    const originalMsg = await message.referencedMessage();
    const { channel: voiceChannel } = originalMsg.member!.voice;
    if (!voiceChannel) {
      await message.edit(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    this.queue.addBefore(new QueueItem(sound, voiceChannel, message));
    this.queue.next();
  }
}
