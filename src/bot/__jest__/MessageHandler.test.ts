import { Message } from 'discord.js';
import '../discord/Message';

import * as ignoreList from '@util/db/IgnoreList';
import CommandCollection from '../CommandCollection';
import MessageHandler from '../MessageHandler';

jest.mock('../../util/Container');

const PREFIX = '!';
const commandCollection = new CommandCollection([]);

describe('MessageHandler', () => {
  const messageHandler = new MessageHandler(commandCollection);

  describe('handle', () => {
    jest.spyOn(commandCollection, 'execute');

    describe('when message is from bot', () => {
      const message = ({
        author: { bot: true },
        hasPrefix: () => true,
        isDirectMessage: () => false
      } as unknown) as Message;

      it('does nothing', () => {
        jest.spyOn(message, 'isDirectMessage');

        messageHandler.handle(message);

        expect(message.author.bot).toBe(true);
        expect(message.isDirectMessage).not.toHaveBeenCalled();
        expect(commandCollection.execute).not.toHaveBeenCalled();
      });
    });

    describe('when message is DM', () => {
      const message = ({
        author: { bot: false },
        channel: { type: 'dm' },
        hasPrefix: () => true,
        isDirectMessage: () => true
      } as unknown) as Message;

      it('does nothing', () => {
        jest.spyOn(message, 'hasPrefix');

        messageHandler.handle(message);

        expect(message.isDirectMessage()).toBe(true);
        expect(message.hasPrefix).not.toHaveBeenCalled();
        expect(commandCollection.execute).not.toHaveBeenCalled();
      });
    });

    describe('when message does not have prefix', () => {
      const message = ({
        author: { bot: false },
        channel: {},
        content: `NOT_${PREFIX}`,
        hasPrefix: () => false,
        isDirectMessage: () => false
      } as unknown) as Message;

      it('does nothing', () => {
        jest.spyOn(ignoreList, 'exists');

        messageHandler.handle(message);

        expect(message.hasPrefix(PREFIX)).toBe(false);
        expect(ignoreList.exists).not.toHaveBeenCalled();
        expect(commandCollection.execute).not.toHaveBeenCalled();
      });
    });

    describe('when user is ignored', () => {
      const message = ({
        author: { bot: false },
        channel: {},
        content: PREFIX,
        hasPrefix: () => true,
        isDirectMessage: () => false
      } as unknown) as Message;

      it('does nothing', () => {
        jest.spyOn(ignoreList, 'exists').mockImplementation(() => true);
        messageHandler.handle(message);

        expect(commandCollection.execute).not.toHaveBeenCalled();
      });
    });

    describe('when message is valid', () => {
      const message = ({
        author: { bot: false },
        channel: {},
        content: PREFIX,
        hasPrefix: () => true,
        isDirectMessage: () => false
      } as unknown) as Message;

      it('executes the command', () => {
        jest.spyOn(ignoreList, 'exists').mockImplementation(() => false);
        jest.spyOn(commandCollection, 'execute').mockImplementation();
        messageHandler.handle(message);

        expect(commandCollection.execute).toHaveBeenCalledWith({ ...message, content: '' });
      });
    });
  });
});
