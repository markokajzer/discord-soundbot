import { GuildMember, VoiceChannel } from 'discord.js';

import getVoiceChannelFromAuthor from '../getVoiceChannelFromAuthor';
import getMessageFixture from '../../../../__jest__/util/getMessageFixture';

describe('getVoiceChannelFromAuthor', () => {
  describe('when not in a voice channel', () => {
    const member = ({} as unknown) as GuildMember;
    const message = getMessageFixture({ member });

    it('replies with a hint', () => {
      getVoiceChannelFromAuthor(message);

      expect(message.reply).toHaveBeenCalled();
    });
  });

  describe('when currently in a voice channel', () => {
    const voiceChannel = ({ id: 'testing' } as unknown) as VoiceChannel;
    const member = ({ voiceChannel } as unknown) as GuildMember;
    const message = getMessageFixture({ member });

    it('returns the channel', () => {
      expect(getVoiceChannelFromAuthor(message).id).toEqual('testing');
    });
  });
});
