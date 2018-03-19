import config from '../config/config.json';

import Discord from 'discord.js';

import CommandCollection from './commands/CommandCollection';
import MessageHandler from './MessageHandler';

export default class SoundBot extends Discord.Client {
  private readonly commands: CommandCollection;
  private readonly messageHandler: MessageHandler;

  constructor(commands = new CommandCollection(), messageHandler = new MessageHandler(commands)) {
    super();
    this.commands = commands;
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
    this.commands.registerUserCommands(this.user);
  }

  private setActivity() {
    this.user.setActivity(config.game);
  }

  private messageListener(message: Discord.Message) {
    this.messageHandler.handle(message);
  }
}
