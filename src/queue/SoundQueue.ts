import { Message, StreamDispatcher, VoiceConnection } from 'discord.js';

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
    } else {
      this.deleteCurrentMessage();
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

    return message.channel.messages.cache.find(msg => msg.id === message.id) === null;
  }

  private isLastSoundFromCurrentMessage(message: Message) {
    return !this.queue.some(item => !!item.message && item.message.id === message.id);
  }
}
