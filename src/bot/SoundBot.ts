import { Client, Guild, Message, TextChannel, VoiceState } from 'discord.js';

import Config from '~/config/Config';
import QueueItem from '~/queue/QueueItem';
import SoundQueue from '~/queue/SoundQueue';
import * as entrances from '~/util/db/Entrances';
import * as exits from '~/util/db/Exits';
import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import Command from '../commands/base/Command';
import CommandCollection from './CommandCollection';
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
    // | 'GUILDS'
    // | 'GUILD_MEMBERS'
    // | 'GUILD_BANS'
    // | 'GUILD_EMOJIS_AND_STICKERS'
    // | 'GUILD_INTEGRATIONS'
    // | 'GUILD_WEBHOOKS'
    // | 'GUILD_INVITES'
    // | 'GUILD_VOICE_STATES'
    // | 'GUILD_PRESENCES'
    // | 'GUILD_MESSAGES'
    // | 'GUILD_MESSAGE_REACTIONS'
    // | 'GUILD_MESSAGE_TYPING'
    // | 'DIRECT_MESSAGES'
    // | 'DIRECT_MESSAGE_REACTIONS'
    // | 'DIRECT_MESSAGE_TYPING'
    // | 'MESSAGE_CONTENT'
    // | 'GUILD_SCHEDULED_EVENTS'
    // | 'AUTO_MODERATION_CONFIGURATION'
    // | 'AUTO_MODERATION_EXECUTION';
    super({
      intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'MESSAGE_CONTENT']
    });

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
    this.on('messageCreate', this.onMessage);
    this.on('voiceStateUpdate', this.onUserLeavesVoiceChannel);
    this.on('voiceStateUpdate', this.onUserJoinsVoiceChannel);
    this.on('guildCreate', this.onBotJoinsServer);
    // this.on('error', error => console.log({ error }));
  }

  private onReady() {
    if (!this.user) return;

    this.user.setActivity(this.config.game);
    this.commands.registerUserCommands(this.user);
  }

  private onUserJoinsVoiceChannel(oldState: VoiceState, newState: VoiceState) {
    const { channel: previousVoiceChannel } = oldState;
    const { channel: currentVoiceChannel, member } = newState;

    if (!member) return;
    if (!currentVoiceChannel || previousVoiceChannel === currentVoiceChannel) return;
    if (!entrances.exists(member.id)) return;

    const sound = entrances.get(member.id);
    if (!getSounds().includes(sound)) return;

    this.queue.add(new QueueItem(sound, currentVoiceChannel));
  }

  private onUserLeavesVoiceChannel(oldState: VoiceState, newState: VoiceState) {
    const { channel: previousVoiceChannel } = oldState;
    const { channel: currentVoiceChannel, member } = newState;

    if (!member) return;
    if (!previousVoiceChannel || previousVoiceChannel === currentVoiceChannel) return;
    if (!exits.exists(member.id)) return;

    const sound = exits.get(member.id);
    if (!getSounds().includes(sound)) return;

    this.queue.add(new QueueItem(sound, previousVoiceChannel));
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
    if (!guild.members.me) return undefined;

    const channels = guild.channels.cache
      .filter(channel => channel.type === 'GUILD_TEXT')
      .filter(channel => {
        const permissions = channel.permissionsFor(guild.members.me!);

        return Boolean(permissions && permissions.has('SEND_MESSAGES'));
      });

    if (!channels.size) return undefined;
    return channels.first() as TextChannel;
  }
}
