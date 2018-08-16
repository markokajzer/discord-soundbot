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
    this.on('guildCreate', this.joinServerListener);
    this.on('message', this.messageListener);
  }

  private readyListener() {
    this.setActivity();
    this.commands.registerUserCommands(this.user);
  }

  private setActivity() {
    this.user.setActivity(config.game);
  }

  private joinServerListener(guild: Discord.Guild) {
    if (!guild.available) return;

    const channel = this.findFirstWritableChannel(guild);
    if (!channel) return;

    const welcomeMessage = [
      '**Thank you for adding me!** 🔥',
      `- My prefix is \`${config.prefix}\`. Want to change it? Check all configuration options here: **<https://github.com/markokajzer/discord-soundbot/wiki/Configuration>**.`,
      `- You can see a list of commands with \`${config.prefix}help\`.`,
      `- Get started by adding a sound. Use \`${config.prefix}add\` and drag in a sound file!`,
      '- Need more help? Join the support server: **<https://discordapp.com/invite/JBw2BNx>**.'
    ];
    channel.send(welcomeMessage.join('\n'));
  }

  private findFirstWritableChannel(guild: Discord.Guild): Discord.TextChannel | null {
    const channels = guild.channels.filter(channel =>
      channel.type === 'text' && channel.permissionsFor(guild.me)!.has('SEND_MESSAGES'));

    if (!channels.size) return null;
    return (channels.first() as Discord.TextChannel);
  }

  private messageListener(message: Discord.Message) {
    this.messageHandler.handle(message);
  }
}
