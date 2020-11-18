/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Message } from 'discord.js';

import { AvatarCommand } from '~/commands/config/AvatarCommand';
import { HelpCommand } from '~/commands/help/HelpCommand';
import { SoundCommand } from '~/commands/sound/SoundCommand';
import Config from '~/config/Config';
import SoundQueue from '~/queue/SoundQueue';
import * as ignoreList from '~/util/db/IgnoreList';

import CommandCollection from '../CommandCollection';
import MessageHandler from '../MessageHandler';

jest.mock('~/util/Container');
jest.mock('~/commands/config/AvatarCommand');
jest.mock('~/commands/help/HelpCommand');
jest.mock('~/commands/sound/SoundCommand');

const queue = ({} as unknown) as SoundQueue;
const config = ({} as unknown) as Config;

const avatarCommand = new AvatarCommand(config);
const helpCommand = new HelpCommand(config);
const soundCommand = new SoundCommand(queue);

const PREFIX = '!';

describe('MessageHandler', () => {
  let commands!: CommandCollection;
  let messageHandler!: MessageHandler;

  const validMessage = ({
    author: { bot: false },
    channel: {
      send: jest.fn()
    },
    content: PREFIX,
    hasPrefix: () => true,
    isDirectMessage: () => false
  } as unknown) as Message;

  beforeEach(() => {
    commands = new CommandCollection([soundCommand]);
    messageHandler = new MessageHandler(commands);

    // @ts-ignore
    jest.spyOn(messageHandler, 'execute');
    jest.spyOn(ignoreList, 'exists').mockImplementation(() => false);
  });

  describe('handle', () => {
    describe('when message is from bot', () => {
      const message = ({
        ...validMessage,
        author: { bot: true }
      } as unknown) as Message;

      it('does nothing', () => {
        jest.spyOn(message, 'isDirectMessage');

        messageHandler.handle(message);

        expect(message.author.bot).toBe(true);
        expect(message.isDirectMessage).not.toHaveBeenCalled();

        // @ts-ignore
        expect(messageHandler.execute).not.toHaveBeenCalled();
      });
    });

    it('does nothing when message is DM', () => {
      const message = ({
        ...validMessage,
        isDirectMessage: () => true
      } as unknown) as Message;
      jest.spyOn(message, 'hasPrefix');

      messageHandler.handle(message);

      expect(message.isDirectMessage()).toBe(true);
      expect(message.hasPrefix).not.toHaveBeenCalled();

      // @ts-ignore
      expect(messageHandler.execute).not.toHaveBeenCalled();
    });

    describe('when message does not have prefix', () => {
      const message = ({
        ...validMessage,
        content: `NOT_${PREFIX}`,
        hasPrefix: () => false
      } as unknown) as Message;

      it('does nothing', () => {
        messageHandler.handle(message);

        expect(message.hasPrefix(PREFIX)).toBe(false);
        expect(ignoreList.exists).not.toHaveBeenCalled();

        // @ts-ignore
        expect(messageHandler.execute).not.toHaveBeenCalled();
      });
    });

    describe('when user is ignored', () => {
      it('does nothing', () => {
        jest.spyOn(ignoreList, 'exists').mockImplementation(() => true);
        messageHandler.handle(validMessage);

        // @ts-ignore
        expect(messageHandler.execute).not.toHaveBeenCalled();
      });
    });

    describe('when message is valid', () => {
      it('executes the command', () => {
        messageHandler.handle(validMessage);

        // @ts-ignore
        expect(messageHandler.execute).toHaveBeenCalledWith({ ...validMessage, content: '' });
      });
    });

    it('executes a given command', () => {
      jest.spyOn(helpCommand, 'run');

      commands.registerCommands([helpCommand]);

      const message = ({ ...validMessage, content: '!help' } as unknown) as Message;
      messageHandler.handle(message);

      expect(helpCommand.run).toHaveBeenCalledWith(message, []);
    });

    it('executes sound command if no command was found', () => {
      jest.spyOn(soundCommand, 'run');

      commands.registerCommands([helpCommand]);
      const message = ({ ...validMessage, content: '!playsound' } as unknown) as Message;
      messageHandler.handle(message);

      expect(soundCommand.run).toHaveBeenCalledWith(message, []);
    });

    it('does not execute an elevated command if user does not have elevated role', () => {
      commands.registerCommands([avatarCommand]);
      jest.spyOn(avatarCommand, 'run');

      const message = ({ ...validMessage, content: '!avatar' } as unknown) as Message;
      messageHandler.handle(message);

      expect(avatarCommand.run).not.toHaveBeenCalled();
    });
  });
});
