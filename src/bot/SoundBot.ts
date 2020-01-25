import { Client, Guild, GuildMember, Message, TextChannel } from 'discord.js';

import Config from '@config/Config';
import QueueItem from '@queue/QueueItem';
import SoundQueue from '@queue/SoundQueue';
import * as entrances from '@util/db/Entrances';
import * as exits from '@util/db/Exits';
import localize from '@util/i18n/localize';
import { getSounds } from '@util/SoundUtil';
import CommandCollection from './CommandCollection';
import Command from './commands/base/Command';
import MessageHandler from './MessageHandler';

export default class SoundBot extends Client {
  private readonly config: Config;
  private readonly commands: CommandCollection;
  private readonly messageHandler: MessageHandler;
  private readonly queue: SoundQueue;

  constructor(
    config: Config,
    commands: CommandCollection,
    messageHandler: MessageHandler,
    queue: SoundQueue
  ) {
    super();

    this.config = config;
    this.commands = commands;
    this.messageHandler = messageHandler;
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
    this.on('voiceStateUpdate', this.onUserLeavesVoiceChannel);
    this.on('voiceStateUpdate', this.onUserJoinsVoiceChannel);
    this.on('guildCreate', this.onBotJoinsServer);
  }

  private onReady() {
    this.user.setActivity(this.config.game);
    this.commands.registerUserCommands(this.user);
  }

  private onUserJoinsVoiceChannel(prevState: GuildMember, user: GuildMember) {
    if (user.id === this.user.id) return;

    if (!user.voiceChannelID || prevState.voiceChannelID === user.voiceChannelID) return;
    if (!entrances.exists(user.id)) return;

    const sound = entrances.get(user.id);
    if (!getSounds().includes(sound)) return;

    const { voiceChannel } = user;
    this.queue.add(new QueueItem(sound, voiceChannel));
  }

  private onUserLeavesVoiceChannel(prevState: GuildMember, user: GuildMember) {
    if (user.id === this.user.id) return;

    if (!prevState.voiceChannelID || prevState.voiceChannelID === user.voiceChannelID) return;
    if (!exits.exists(user.id)) return;

    const sound = exits.get(user.id);
    if (!getSounds().includes(sound)) return;

    const { voiceChannel } = prevState;
    this.queue.add(new QueueItem(sound, voiceChannel));
  }

  private onMessage(message: Message) {
    this.messageHandler.handle(message);
  }

  private onBotJoinsServer(guild: Guild) {
    if (!guild.available) return;

    const channel = this.findFirstWritableChannel(guild);
    if (!channel) return;

    channel.send(localize.t('welcome', { prefix: this.config.prefix }));
  }

  private findFirstWritableChannel(guild: Guild) {
    const channels = guild.channels.filter(
      channel => channel.type === 'text' && channel.permissionsFor(guild.me)!.has('SEND_MESSAGES')
    );

    if (!channels.size) return undefined;
    return channels.first() as TextChannel;
  }
}
