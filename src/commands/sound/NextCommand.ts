import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import localize from '~/util/i18n/localize';
import { existsSound } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class NextCommand extends QueueCommand {
  public readonly triggers = ['next'];
  public readonly numberOfParameters = 1;
  public readonly usage = '!next <sound>';

  public run(message: Message, params: string[]) {
    if (!message.member) return;

    if (params.length !== this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const [sound] = params;
    if (!existsSound(sound)) return;

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    this.queue.addBefore(new QueueItem(sound, voiceChannel, message));
    this.queue.next();
  }
}
