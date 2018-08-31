import { Message } from 'discord.js';

import LocaleService from '../../../util/i18n/LocaleService';

export default class VoiceChannelFinder {
  private readonly localeService: LocaleService;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public getVoiceChannelFromMessageAuthor(message: Message) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      message.reply(this.localeService.t('helpers.voiceChannelFinder.error'));
    }

    return voiceChannel;
  }
}
