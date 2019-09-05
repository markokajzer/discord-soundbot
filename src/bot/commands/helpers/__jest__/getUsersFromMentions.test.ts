import { MessageMentions } from 'discord.js';

import getUsersFromMentions from '../getUsersFromMentions';
import getMessageFixture from '../../../../__jest__/util/getMessageFixture';

describe('getUsersFromMentions', () => {
  describe('when mentions does not contain a user', () => {
    const mentions = ({ users: new Map() } as unknown) as MessageMentions;
    const message = getMessageFixture({ mentions });
    const usage = 'Test';

    it('returns the usage', () => {
      const { channel } = message;
      getUsersFromMentions(message, usage);

      expect(channel.send).toHaveBeenCalledTimes(2);
      expect(channel.send).toHaveBeenCalledWith(usage);
    });
  });

  describe('when message contains mentions', () => {
    const users = new Map([['1', { id: '1' }]]);
    const mentions = ({ users } as unknown) as MessageMentions;
    const message = getMessageFixture({ mentions });

    it('returns the users', () => {
      const { channel } = message;
      expect(getUsersFromMentions(message, 'Test')).toEqual(users);

      expect(channel.send).not.toHaveBeenCalled();
    });
  });
});
