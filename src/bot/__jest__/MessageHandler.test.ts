import { Message, DMChannel } from 'discord.js';
import '../../discord/Message';

import Config from '@config/Config';
import * as ignoreList from '@util/db/IgnoreList';
import MessageHandler from '../MessageHandler';
import CommandCollection from '../CommandCollection';

const PREFIX = '!';
const config = { prefix: PREFIX } as Config;
const commandCollection = new CommandCollection([]);

describe('MessageHandler', () => {
  const messageHandler = new MessageHandler(config, commandCollection);

  describe('handle', () => {
    jest.spyOn(commandCollection, 'execute');

    describe('when message is from bot', () => {
      const message = ({
        author: { bot: true }
      } as unknown) as Message;
      Object.setPrototypeOf(message, Message.prototype);

      it('does nothing', () => {
        jest.spyOn(message, 'isDirectMessage');
        messageHandler.handle(message);

        expect(commandCollection.execute).not.toHaveBeenCalled();
        expect(message.isDirectMessage).not.toHaveBeenCalled();
      });
    });

    describe('when message is DM', () => {
      const channel = ({} as unknown) as DMChannel;
      Object.setPrototypeOf(channel, DMChannel.prototype);

      const message = ({
        author: { bot: false },
        channel
      } as unknown) as Message;
      Object.setPrototypeOf(message, Message.prototype);

      it('does nothing', () => {
        jest.spyOn(message, 'hasPrefix');
        messageHandler.handle(message);

        expect(commandCollection.execute).not.toHaveBeenCalled();
        expect(message.hasPrefix).not.toHaveBeenCalled();
      });
    });

    describe('when message does not have prefix', () => {
      const message = ({
        author: { bot: false },
        content: `NOT_${PREFIX}`
      } as unknown) as Message;
      Object.setPrototypeOf(message, Message.prototype);

      it('does nothing', () => {
        jest.spyOn(ignoreList, 'exists');
        messageHandler.handle(message);

        expect(commandCollection.execute).not.toHaveBeenCalled();
        expect(ignoreList.exists).not.toHaveBeenCalled();
      });
    });

    describe('when user is ignored', () => {
      const message = ({
        author: { bot: false },
        content: PREFIX
      } as unknown) as Message;
      Object.setPrototypeOf(message, Message.prototype);

      it('does nothing', () => {
        jest.spyOn(ignoreList, 'exists').mockImplementation(() => true);
        messageHandler.handle(message);

        expect(commandCollection.execute).not.toHaveBeenCalled();
      });
    });

    describe('when message is valid', () => {
      const message = ({
        author: { bot: false },
        content: PREFIX
      } as unknown) as Message;
      Object.setPrototypeOf(message, Message.prototype);

      it('executes the command', () => {
        jest.spyOn(ignoreList, 'exists').mockImplementation(() => false);
        jest.spyOn(commandCollection, 'execute').mockImplementation();
        messageHandler.handle(message);

        expect(commandCollection.execute).toHaveBeenCalledWith({ ...message, content: '' });
      });
    });
  });
});
