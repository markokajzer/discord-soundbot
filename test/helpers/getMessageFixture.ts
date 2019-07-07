import { Message } from 'discord.js';

import getChannelFixture from './getChannelFixture';

const getMessageFixture = (overrides?: Partial<Message>): Message => ({
  channel: getChannelFixture(),
  ...overrides
} as unknown as Message);

export default getMessageFixture;
