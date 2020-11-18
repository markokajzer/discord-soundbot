import { ClientUser, Collection, GuildMember } from 'discord.js';

import Command from '~/commands/base/Command';
import { AvatarCommand } from '~/commands/config/AvatarCommand';
import { HelpCommand } from '~/commands/help/HelpCommand';
import { SoundCommand } from '~/commands/sound/SoundCommand';
import Config from '~/config/Config';
import SoundQueue from '~/queue/SoundQueue';

import getMessageFixture from '../../../test/getMessageFixture';
import CommandCollection from '../CommandCollection';

jest.mock('~/util/Container');
jest.mock('~/commands/config/AvatarCommand');
jest.mock('~/commands/help/HelpCommand');
jest.mock('~/commands/sound/SoundCommand');

const queue = ({} as unknown) as SoundQueue;
const config = ({} as unknown) as Config;

const avatarCommand = new AvatarCommand(config);
const helpCommand = new HelpCommand(config);
const soundCommand = new SoundCommand(queue);

describe('CommandCollection', () => {
  let commands!: CommandCollection;

  beforeEach(() => {
    commands = new CommandCollection([soundCommand]);
  });

  it('correctly registers commands', () => {
    commands.registerCommands([helpCommand]);
    // Access private field
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const triggers = (commands as any).triggers as Map<string, Command>;

    expect(Array.from(triggers.keys())).toEqual(['commands', 'help']);
    expect(triggers.get('commands')).toEqual(helpCommand);
    expect(triggers.get('help')).toEqual(helpCommand);
  });

  it('correctly registers user commands', () => {
    jest.spyOn(avatarCommand, 'setClientUser');

    commands.registerCommands([avatarCommand]);

    const user = ({ id: 'USER_ID' } as unknown) as ClientUser;
    commands.registerUserCommands(user);

    expect(avatarCommand.setClientUser).toHaveBeenCalledWith(user);
  });

  it('executes a given command', () => {
    jest.spyOn(helpCommand, 'run');

    commands.registerCommands([helpCommand]);

    const message = getMessageFixture({ content: 'help' });
    commands.execute(message);

    expect(helpCommand.run).toHaveBeenCalledWith(message, []);
  });

  it('executes sound command if no command was found', () => {
    jest.spyOn(soundCommand, 'run');

    commands.registerCommands([helpCommand]);
    const message = getMessageFixture({ content: 'sound' });
    commands.execute(message);

    expect(soundCommand.run).toHaveBeenCalledWith(message, []);
  });

  it('does not execute an elevated command if user does not have elevated role', () => {
    jest.spyOn(soundCommand, 'run');

    commands.registerCommands([avatarCommand]);

    const message = getMessageFixture({ content: 'avatar' });
    commands.execute(message);

    expect(soundCommand.run).not.toHaveBeenCalled();
  });
});
