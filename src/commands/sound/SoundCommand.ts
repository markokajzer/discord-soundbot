import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import localize from '~/util/i18n/localize';
import { existsSound } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class SoundCommand extends QueueCommand {
  public readonly triggers = [];

  public async run(message: Message) {
    if (!message.reference!.guildID) return;

    const originalMsg = await message.referencedMessage();
    const sound = originalMsg.content;
    if (!existsSound(sound)) {
      await message.edit(localize.t('errors.sounds.notFound', { sound }));
      return;
    }

    const { channel: voiceChannel } = originalMsg.member!.voice;
    if (!voiceChannel) {
      await message.edit(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
