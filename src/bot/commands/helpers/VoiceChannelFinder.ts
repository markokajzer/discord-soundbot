import { Message } from 'discord.js';

import localize from '@util/i18n/localize';

export default class VoiceChannelFinder {
  public getVoiceChannelFromMessageAuthor(message: Message) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      message.reply(localize.t('helpers.voiceChannelFinder.error'));
    }

    return voiceChannel;
  }
}
