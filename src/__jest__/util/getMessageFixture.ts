import { Message } from 'discord.js';

import getChannelFixture from './getChannelFixture';

const getMessageFixture = (overrides?: Partial<Message>): Message =>
  (({
    channel: getChannelFixture(),
    reply: jest.fn(),
    ...overrides
  } as unknown) as Message);

export default getMessageFixture;
