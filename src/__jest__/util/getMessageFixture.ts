import { Message } from 'discord.js';

import getChannelFixture from './getChannelFixture';

interface PartialMessage {
  content?: string;
}

const getMessageFixture = (overrides?: PartialMessage): Message =>
  (({
    channel: getChannelFixture(),
    reply: jest.fn(),
    ...overrides
  } as unknown) as Message);

export default getMessageFixture;
