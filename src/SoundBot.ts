import config from '../config/config.json';

import fs from 'fs';

import Discord from 'discord.js';

import MessageHandler from './MessageHandler';

export default class SoundBot extends Discord.Client {
  private readonly messageHandler: MessageHandler;

  constructor(messageHandler: MessageHandler) {
    super();
    this.messageHandler = messageHandler;
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
    const avatar = this.avatarExists() ? './config/avatar.png' : '';
    this.user.setAvatar(avatar);
  }

  private messageListener(message: Discord.Message) {
    this.messageHandler.handle(message);
  }

  private avatarExists() {
    return fs.existsSync('./config/avatar.png');
  }
}
