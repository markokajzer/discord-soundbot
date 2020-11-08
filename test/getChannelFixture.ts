import { TextChannel } from 'discord.js';

const getChannelFixture = (overrides?: Partial<TextChannel>): TextChannel =>
  (({
    send: jest.fn(),
    ...overrides
  } as unknown) as TextChannel);

export default getChannelFixture;
