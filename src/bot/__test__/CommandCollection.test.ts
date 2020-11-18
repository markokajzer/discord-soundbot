import { ClientUser } from 'discord.js';

import { AvatarCommand } from '~/commands/config/AvatarCommand';
import { HelpCommand } from '~/commands/help/HelpCommand';
import { SoundCommand } from '~/commands/sound/SoundCommand';
import Config from '~/config/Config';
import SoundQueue from '~/queue/SoundQueue';

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

  describe('registerCommands', () => {
    it('correctly registers commands', () => {
      commands.registerCommands([helpCommand]);

      // @ts-ignore
      const { triggers } = commands;

      expect(Array.from(triggers.keys())).toEqual(['commands', 'help']);
      expect(triggers.get('commands')).toEqual(helpCommand);
      expect(triggers.get('help')).toEqual(helpCommand);
    });
  });

  describe('registerUserCommands', () => {
    it('correctly registers user commands', () => {
      jest.spyOn(avatarCommand, 'setClientUser');

      commands.registerCommands([avatarCommand]);

      const user = ({ id: 'USER_ID' } as unknown) as ClientUser;
      commands.registerUserCommands(user);

      expect(avatarCommand.setClientUser).toHaveBeenCalledWith(user);
    });
  });

  describe('get', () => {
    it('returns SoundCommand if no trigger registered for message', () => {
      expect(commands.get('airhorn')).toEqual(soundCommand);
    });

    it('returns the command refering to a given trigger', () => {
      commands.registerCommands([helpCommand]);

      expect(commands.get('help')).toEqual(helpCommand);
    });
  });
});
