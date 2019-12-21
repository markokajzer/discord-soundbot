import { Client, Guild, Message, TextChannel, User, VoiceChannel, VoiceState } from 'discord.js';

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
    this.on('voiceStateUpdate', this.handleVoiceStateUpdate);
    this.on('guildCreate', this.onBotJoinsServer);
  }

  private onReady() {
    if (!this.user) return;

    this.user.setActivity(this.config.game);
    this.commands.registerUserCommands(this.user);
  }

  private handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    if (!oldState.channelID && newState.channelID) {
      return this.onUserJoinsVoiceChannel(newState.channel!, newState.member!.user);
    }

    if (oldState.channelID && !newState.channelID) {
      return this.onUserLeavesVoiceChannel(oldState.channel!, oldState.member!.user);
    }
  }

  private onUserJoinsVoiceChannel(channel: VoiceChannel, user: User) {
    if (!entrances.exists(user.id)) {
      return;
    }

    const sound = entrances.get(user.id);
    if (!getSounds().includes(sound)) {
      return;
    }

    this.queue.add(new QueueItem(sound, channel));
  }

  private onUserLeavesVoiceChannel(channel: VoiceChannel, user: User) {
    if (!exits.exists(user.id)) {
      return;
    }

    const sound = exits.get(user.id);
    if (!getSounds().includes(sound)) return;

    this.queue.add(new QueueItem(sound, channel!));
  }

  private onMessage(message: Message) {
    this.messageHandler.handle(message);
  }

  private onBotJoinsServer(guild: Guild) {
    if (!guild!.available) return;

    const channel = this.findFirstWritableChannel(guild);
    if (!channel) return;

    channel.send(localize.t('welcome', { prefix: this.config.prefix }));
  }

  private findFirstWritableChannel(guild: Guild) {
    if (!guild.me) return undefined;

    const channels = guild.channels
      .filter(channel => channel.type === 'text')
      .filter(channel => {
        const permissions = channel.permissionsFor(guild.me!);

        return Boolean(permissions && permissions.has('SEND_MESSAGES'));
      });

    if (!channels.size) return undefined;
    return channels.first() as TextChannel;
  }
}
