import { Message } from 'discord.js';

import localize from '@util/i18n/localize';

const getUsersFromMentions = (message: Message, usage: string) => {
  const { users } = message.mentions;
  if (users.size < 1) {
    message.channel.send(usage);
    message.channel.send(localize.t('helpers.userFinder.error'));
  }

  return users;
};

export default getUsersFromMentions;
