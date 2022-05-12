import { StreamDispatcher, VoiceConnection } from 'discord.js';

import Config from '~/config/Config';
import * as sounds from '~/util/db/Sounds';
import localize from '~/util/i18n/localize';
import { getPathForSound } from '~/util/SoundUtil';

import ChannelTimeout from './ChannelTimeout';
import QueueItem from './QueueItem';

export default class SoundQueue {
  private readonly config: Config;

  private queue: QueueItem[] = [];
  private currentSound: Nullable<QueueItem>;
  private dispatcher: Nullable<StreamDispatcher>;

  constructor(config: Config) {
    this.config = config;
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
    if (!this.dispatcher) return;

    this.dispatcher.emit('finish');
  }

  public clear() {
    if (!this.currentSound) return;

    // Prevent further looping
    this.currentSound.count = 0;
    this.queue = [];
  }

  private isStartable() {
    return !this.currentSound;
  }

  private async playNext() {
    this.currentSound = this.queue.shift()!;
    const sound = getPathForSound(this.currentSound.name);

    try {
      const connection = await this.currentSound.channel.join();
      this.deafen(connection);

      await this.playSound(connection, sound);
      this.handleFinishedPlayingSound(connection);
    } catch (error) {
      this.handleError(error);
    }
  }

  // NOTE: Can only deafen when in a channel, therefore need connection
  private deafen(connection: VoiceConnection) {
    if (!connection.voice) return;
    if (connection.voice.selfDeaf === this.config.deafen) return;

    connection.voice.setDeaf(this.config.deafen);
  }

  private playSound(connection: VoiceConnection, name: string): Promise<void> {
    return new Promise(resolve => {
      this.dispatcher = connection
        .play(name, { volume: this.config.volume })
        .on('finish', resolve)
        .on('close', resolve);
    });
  }

  private handleFinishedPlayingSound(connection: VoiceConnection) {
    const { name, channel, message, count } = this.currentSound!;
    sounds.incrementCount(name);

    if (count > 1) {
      this.add(new QueueItem(name, channel, message, count - 1));
    }

    this.currentSound = null;
    this.dispatcher = null;

    if (!this.isEmpty()) {
      this.playNext();
      return;
    }

    if (!this.config.stayInChannel) {
      connection.disconnect();
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
    this.dispatcher = null;
  }

  private isEmpty() {
    return this.queue.length === 0;
  }
}
