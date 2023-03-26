import {
  AudioPlayer,
  AudioPlayerState,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus
} from '@discordjs/voice';
import { Message } from 'discord.js';

import Config from '~/config/Config';
import * as sounds from '~/util/db/Sounds';
import localize from '~/util/i18n/localize';
import { getPathForSound } from '~/util/SoundUtil';

import ChannelTimeout from './ChannelTimeout';
import QueueItem from './QueueItem';

export default class SoundQueue {
  private readonly config: Config;

  private readonly player: AudioPlayer;
  private queue: QueueItem[] = [];
  private currentSound: Nullable<QueueItem>;

  constructor(config: Config) {
    this.config = config;
    this.player = createAudioPlayer();
  }

  public add(item: QueueItem) {
    this.queue.push(item);
    if (this.isStartable()) this.playNext();
  }

  public addBefore(item: QueueItem) {
    this.queue.unshift(item);

    if (this.isStartable()) this.playNext();
  }

  public next() {
    this.player.emit('next');
  }

  public clear() {
    if (!this.currentSound) return;
    if (this.config.deleteMessages) this.deleteMessages();

    // Prevent further looping
    this.currentSound.count = 0;
    this.queue = [];
  }

  private isStartable() {
    return !this.currentSound;
  }

  private deleteMessages() {
    if (!this.currentSound) return;
    if (this.isEmpty()) return;

    let deleteableMessages = this.queue
      .map(item => item.message)
      .filter((message): message is Message => !!message);

    const { message: currentMessage } = this.currentSound;
    if (currentMessage) {
      deleteableMessages = deleteableMessages.filter(msg => msg.id !== currentMessage.id);
    }

    // Do not try to delete the same sound multiple times (!combo)
    Array.from(new Set(deleteableMessages)).forEach(message => message.delete());
  }

  private async playNext() {
    this.currentSound = this.queue.shift()!;

    try {
      const connection = joinVoiceChannel({
        adapterCreator: this.currentSound.channel.guild
          .voiceAdapterCreator as DiscordGatewayAdapterCreator,
        channelId: this.currentSound.channel.id,
        guildId: this.currentSound.channel.guild.id
      });

      await this.playSound(connection);
      this.handleFinishedPlayingSound(connection);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private playSound(connection: VoiceConnection): Promise<void> {
    const sound = getPathForSound(this.currentSound!.name);
    const resource = createAudioResource(sound);

    connection.subscribe(this.player);

    return new Promise(resolve => {
      this.player.play(resource);
      this.player.on('stateChange', (oldState, newState) => {
        // TODO: check if this runs multiple times when looping / playing multiple sounds
        if (this.becameIdleAfterPlaying(oldState, newState)) resolve();
      });
      // @ts-expect-error
      this.player.on('next', resolve);

      // TODO: Forgot why we need this. Investigate.
      connection.on('stateChange', (_, newState) => {
        if (newState.status === VoiceConnectionStatus.Disconnected) resolve();
      });
    });
  }

  private handleFinishedPlayingSound(connection: VoiceConnection) {
    const { name, channel, message, count } = this.currentSound!;
    sounds.incrementCount(name);

    if (count > 1) {
      this.add(new QueueItem(name, channel, message, count - 1));
    } else {
      this.deleteCurrentMessage();
    }

    this.currentSound = null;

    if (!this.isEmpty()) {
      this.playNext();
      return;
    }

    if (!this.config.stayInChannel) {
      connection.destroy();
      return;
    }

    if (this.config.timeout > 0) ChannelTimeout.start(connection);
  }

  private async handleError(error: { code: string }) {
    if (error.code === 'VOICE_JOIN_CHANNEL' && this.currentSound?.message) {
      await this.currentSound.message.channel.send(localize.t('errors.permissions'));
      process.exit();
    }

    console.error('Error occured!', '\n', error);

    this.currentSound = null;
  }

  private deleteCurrentMessage() {
    if (!this.config.deleteMessages) return;
    if (!this.currentSound || !this.currentSound.message) return;
    if (!this.isLastSoundFromCurrentMessage(this.currentSound.message)) return;
    if (this.wasMessageAlreadyDeleted(this.currentSound.message)) return;

    this.currentSound.message.delete();
  }

  private isEmpty() {
    return this.queue.length === 0;
  }

  private wasMessageAlreadyDeleted(message: Message) {
    if (!message) return false;

    return !message.channel.messages.cache.has(message.id);
  }

  private isLastSoundFromCurrentMessage(message: Message) {
    return !this.queue.some(item => !!item.message && item.message.id === message.id);
  }

  private becameIdleAfterPlaying(oldState: AudioPlayerState, newState: AudioPlayerState) {
    return (
      oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle
    );
  }
}
