import config from '../config/config.json';

import Discord from 'discord.js';
import './Discord/Message';

import MessageHandler from './MessageHandler';
import Util from './Util';

export default class SoundBot extends Discord.Client {
  private messageHandler = new MessageHandler(config.prefix);

  public constructor() {
    super();
    this.addEventListeners();
  }

  public start() {
    this.login(config.token);
  }

  private addEventListeners() {
    this.on('ready', this.readyListener);
    this.on('message', this.messageListener);
  }

  private readyListener() {
    this.setActivity();
    this.setAvatar();
  }

  private setActivity() {
    this.user.setActivity(config.game);
  }

  private setAvatar() {
    const avatar = Util.avatarExists() ? './config/avatar.png' : '';
    this.user.setAvatar(avatar);
  }

  private messageListener(message: Discord.Message) {
    this.messageHandler.handle(message);
  }
}
