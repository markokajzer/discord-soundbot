import { GuildMember, Message } from 'discord.js';

import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import localize from '@util/i18n/localize';
import { existsSound } from '@util/SoundUtil';
import Command from './base/Command';

export default class SoundCommand implements Command {
  public readonly TRIGGERS = [];

  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message) {
    const sound = message.content;
    if (!message.member || !existsSound(sound)) return;

    const { channel } = message.member.voice;
    if (!channel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
      return;
    }

    this.queue.add(new QueueItem(sound, channel, message));
  }
}
