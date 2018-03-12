import fs from 'fs';
import Discord from 'discord.js';

import { token, game } from '../config/config.json'
import SoundBot from  '../src/SoundBot';
import MessageHandler from '../src/MessageHandler';

describe('SoundBot', () => {
  let bot: SoundBot;

  beforeEach(() => {
    bot = new SoundBot();
  });

  describe('#login', () => {
    beforeEach(() => {
      spyOn(bot, 'login');
    });

    it('starts the bot', () => {
      bot.start();
      expect(bot.login).toHaveBeenCalledWith(token);
    });
  });

  describe('#addEventListeners', () => {
    beforeEach(() => {
      spyOn((bot as any), 'setActivity');
      spyOn((bot as any), 'setAvatar');
      (bot as any).messageHandler = jasmine.createSpyObj('MessageHandler', ['handle']);
    });

    it('registers ready listeners', () => {
      bot.emit('ready');
      expect((bot as any).setActivity).toHaveBeenCalledTimes(1);
      expect((bot as any).setAvatar).toHaveBeenCalledTimes(1);
    });

    it('registers message listeners', () => {
      bot.emit('message');
      expect((bot as any).messageHandler.handle).toHaveBeenCalledTimes(1);
    });
  });

  describe('#setActivity', () => {
    beforeEach(() => {
      bot.user = jasmine.createSpyObj('user', ['setActivity']);
    });

    it('sets activity', () => {
      (bot as any).setActivity();
      expect(bot.user.setActivity).toHaveBeenCalledWith(game);
    });
  });

  describe('#setAvatar', () => {
    describe('when avatar exists', () => {
      beforeEach(() => {
        spyOn(fs, 'existsSync').and.returnValue(true);
        bot.user = jasmine.createSpyObj('user', ['setAvatar']);
      });

      it('sets the avatar', () => {
        expect((bot as any).avatarExists()).toBe(true);

        (bot as any).setAvatar();
        expect(bot.user.setAvatar).toHaveBeenCalledWith('./config/avatar.png');
      });
    });

    describe('when avatar does not exist', () => {
      beforeEach(() => {
        spyOn(fs, 'existsSync').and.returnValue(false);
        bot.user = jasmine.createSpyObj('user', ['setAvatar']);
      });

      it('sets the avatar', () => {
        expect((bot as any).avatarExists()).toBe(false);

        (bot as any).setAvatar();
        expect(bot.user.setAvatar).toHaveBeenCalledWith('');
      });
    });
  });
})
