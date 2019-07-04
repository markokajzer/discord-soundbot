import Discord from 'discord.js';

import Config from '@config/Config';
import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import DatabaseAdapter from '@util/db/DatabaseAdapter';
import LocaleService from '@util/i18n/LocaleService';
import { getSounds } from '@util/SoundUtil';
import CommandCollection from './CommandCollection';
import Command from './commands/base/Command';
import MessageHandler from './MessageHandler';

export default class SoundBot extends Discord.Client {
  private readonly config: Config;
  private readonly localeService: LocaleService;
  private readonly commands: CommandCollection;
  private readonly messageHandler: MessageHandler;
  private readonly db: DatabaseAdapter;
  private readonly queue: SoundQueue;

  constructor(config: Config, localeService: LocaleService,
              commands: CommandCollection, messageHandler: MessageHandler,
              db: DatabaseAdapter, queue: SoundQueue) {
    super();
    this.config = config;
    this.localeService = localeService;
    this.commands = commands;
    this.messageHandler = messageHandler;
    this.db = db;
    this.queue = queue;

    this.addEventListeners();
  }

  public start() {
    this.login(this.config.token);
  }

  public registerAdditionalCommands(commands: Command[]) {
    this.commands.registerCommands(commands);
  }

  private addEventListeners() {
    this.on('ready', this.onReady);
    this.on('message', this.onMessage);
    this.on('voiceStateUpdate', this.onUserJoinsVoiceChannel);
    this.on('guildCreate', this.onBotJoinsServer);
  }

  private onReady() {
    this.user.setActivity(this.config.game);
    this.commands.registerUserCommands(this.user);
  }

  private onUserJoinsVoiceChannel(prevState: Discord.GuildMember, user: Discord.GuildMember) {
    if (!user.voiceChannelID || prevState.voiceChannelID === user.voiceChannelID) return;
    if (!this.db.entrances.exists(user.id)) return;

    const sound = this.db.entrances.get(user.id);
    if (!getSounds().includes(sound)) return;

    const voiceChannel = user.voiceChannel;
    this.queue.add(new QueueItem(sound, voiceChannel));
  }

  private onMessage(message: Discord.Message) {
    this.messageHandler.handle(message);
  }

  private onBotJoinsServer(guild: Discord.Guild) {
    if (!guild.available) return;

    const channel = this.findFirstWritableChannel(guild);
    if (!channel) return;

    channel.send(this.localeService.t('welcome', { prefix: this.config.prefix }));
  }

  private findFirstWritableChannel(guild: Discord.Guild) {
    const channels = guild.channels.filter(channel =>
      channel.type === 'text' && channel.permissionsFor(guild.me)!.has('SEND_MESSAGES'));

    if (!channels.size) return;
    return (channels.first() as Discord.TextChannel);
  }
}
