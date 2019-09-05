import { ClientUser } from 'discord.js';
import Config from '@config/Config';
import SoundQueue from '@queue/SoundQueue';
import getMessageFixture from '../../__jest__/util/getMessageFixture';
import CommandCollection from '../CommandCollection';
import AvatarCommand from '../commands/AvatarCommand';
import Command from '../commands/base/Command';
import HelpCommand from '../commands/HelpCommand';
import SoundCommand from '../commands/SoundCommand';

jest.mock('../commands/AvatarCommand');
jest.mock('../commands/HelpCommand');
jest.mock('../commands/SoundCommand');

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

    expect(helpCommand.run).toHaveBeenCalledWith({ ...message, content: '' }, []);
    expect(message.content).toEqual('');
  });

  it('executes sound command if no command was found', () => {
    jest.spyOn(soundCommand, 'run');

    commands.registerCommands([helpCommand]);
    const message = getMessageFixture({ content: 'sound' });
    commands.execute(message);

    expect(soundCommand.run).toHaveBeenCalledWith(message);
    expect(message.content).toEqual('sound');
  });
});
