import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import localize from '~/util/i18n/localize';
import { existsSound } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class SoundCommand extends QueueCommand {
  public readonly triggers = [];

  public run(message: Message) {
    if (!message.member) return;

    const sound = message.content;
    if (!existsSound(sound)) return;

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    this.queue.add(new QueueItem(sound, voiceChannel, message));
  }
}
