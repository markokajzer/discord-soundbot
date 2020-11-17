import { Message } from 'discord.js';

import QueueItem from '~/queue/QueueItem';
import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import QueueCommand from '../base/QueueCommand';

export class ComboCommand extends QueueCommand {
  public readonly triggers = ['combo'];
  public readonly numberOfParameters = 1;
  public readonly usage = 'Usage: !combo <sound1> ... <soundN>';

  public run(message: Message, params: string[]) {
    if (!message.member) return;

    if (params.length < this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const { channel: voiceChannel } = message.member.voice;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
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
