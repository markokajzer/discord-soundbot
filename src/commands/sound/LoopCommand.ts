import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import localize from '~/util/i18n/localize';
import { existsSound } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class LoopCommand extends QueueCommand {
  public readonly triggers = ['loop', 'repeat'];
  public readonly numberOfParameters = 2;
  public readonly usage = 'Usage: !loop <sound> <count>';

  public run(message: Message, params: string[]) {
    if (!message.member) return;

    if (params.length > this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const [sound, countAsString] = params;
    if (!existsSound(sound)) return;

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    const count = parseInt(countAsString) || Number.MAX_SAFE_INTEGER;
    const item = new QueueItem(sound, voiceChannel, message, count);

    this.queue.add(item);
  }
}
