import { Client, ClientUser, Message, TextChannel, UserManager } from 'discord.js';

import '~/discord/Message';
import { AvatarCommand } from '~/commands/config/AvatarCommand';
import { HelpCommand } from '~/commands/help/HelpCommand';
import { SoundCommand } from '~/commands/sound/SoundCommand';
import Config from '~/config/Config';
import DEFAULT_CONFIG from '~/config/DefaultConfig';
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

describe('MessageHandler', () => {
  let commands!: CommandCollection;
  let messageHandler!: MessageHandler;
  let message!: Message;

  beforeEach(() => {
    commands = new CommandCollection([soundCommand]);
    messageHandler = new MessageHandler(commands);
    message = new Message(
      {
        users: ({
          add: jest.fn((user: ClientUser) => user)
        } as unknown) as UserManager
      } as Client,
      {
        author: {
          bot: false
        },
        content: '',
        id: '123456'
      },
      ({
        send: jest.fn(),
        type: 'text'
      } as unknown) as TextChannel
    );

    // @ts-ignore
    jest.spyOn(messageHandler, 'execute');
    jest.spyOn(ignoreList, 'exists').mockImplementation(() => false);
  });

  describe('handle', () => {
    it('does nothing when message is from bot', () => {
      Object.defineProperty(message.author, 'bot', { value: true });
      jest.spyOn(message, 'isDirectMessage');

      messageHandler.handle(message);

      expect(message.author.bot).toBe(true);
      expect(message.isDirectMessage).not.toHaveBeenCalled();

      // @ts-ignore
      expect(messageHandler.execute).not.toHaveBeenCalled();
    });

    it('does nothing when message is DM', () => {
      Object.defineProperty(message.channel, 'type', { value: 'dm' });
      jest.spyOn(message, 'hasPrefix');

      messageHandler.handle(message);

      expect(message.isDirectMessage()).toBe(true);
      expect(message.hasPrefix).not.toHaveBeenCalled();

      // @ts-ignore
      expect(messageHandler.execute).not.toHaveBeenCalled();
    });

    it('does nothing when message does not have prefix', () => {
      Object.defineProperty(message, 'content', { value: 'NOT_PREFIX' });
      messageHandler.handle(message);

      expect(message.hasPrefix(DEFAULT_CONFIG.prefix!)).toBe(false);
      expect(ignoreList.exists).not.toHaveBeenCalled();

      // @ts-ignore
      expect(messageHandler.execute).not.toHaveBeenCalled();
    });

    it('does nothing when user is ignored', () => {
      jest.spyOn(ignoreList, 'exists').mockImplementation(() => true);
      messageHandler.handle(message);

      // @ts-ignore
      expect(messageHandler.execute).not.toHaveBeenCalled();
    });

    it('executes a given command when the command is valid', () => {
      Object.defineProperty(message, 'content', { value: '!help' });
      jest.spyOn(helpCommand, 'run');

      commands.registerCommands([helpCommand]);
      messageHandler.handle(message);

      // @ts-ignore
      expect(messageHandler.execute).toHaveBeenCalledWith(message);
      expect(helpCommand.run).toHaveBeenCalledWith(message, []);
    });

    it('executes sound command if no command was found', () => {
      Object.defineProperty(message, 'content', { value: '!airhorn' });
      jest.spyOn(soundCommand, 'run');

      commands.registerCommands([helpCommand]);
      messageHandler.handle(message);

      // @ts-ignore
      expect(messageHandler.execute).toHaveBeenCalledWith(message);
      expect(soundCommand.run).toHaveBeenCalledWith(message, []);
    });

    it('does not execute an elevated command if user does not have elevated role', () => {
      Object.defineProperty(message, 'content', { value: '!avatar' });
      jest.spyOn(avatarCommand, 'run');

      commands.registerCommands([avatarCommand]);
      messageHandler.handle(message);

      // @ts-ignore
      expect(messageHandler.execute).toHaveBeenCalledWith(message);
      expect(avatarCommand.run).not.toHaveBeenCalled();
    });
  });
});
