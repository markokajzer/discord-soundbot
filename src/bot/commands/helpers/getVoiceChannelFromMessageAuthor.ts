import { Message } from 'discord.js';

import localize from '@util/i18n/localize';

const getVoiceChannelFromMessageAuthor = (message: Message) => {
  const { voiceChannel } = message.member;
  if (!voiceChannel) {
    message.reply(localize.t('helpers.voiceChannelFinder.error'));
  }

  return voiceChannel;
};

export default getVoiceChannelFromMessageAuthor;
