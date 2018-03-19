import { token, game } from '../config/config.json'
import SoundBot from  '../src/SoundBot';

describe('SoundBot', () => {
  const bot = new SoundBot();

  describe('#login', () => {
    beforeAll(() => {
      spyOn(bot, 'login');
    });

    it('starts the bot', () => {
      bot.start();
      expect(bot.login).toHaveBeenCalledWith(token);
    });
  });

  describe('#addEventListeners', () => {
    beforeAll(() => {
      spyOn((bot as any), 'setActivity');
      (bot as any).messageHandler = jasmine.createSpyObj('MessageHandler', ['handle']);
    });

    it('registers ready listeners', () => {
      bot.emit('ready');
      expect((bot as any).setActivity).toHaveBeenCalledTimes(1);
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
})
