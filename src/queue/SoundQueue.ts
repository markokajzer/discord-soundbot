import { Message, StreamDispatcher, VoiceConnection } from 'discord.js';

import Config from '@config/Config';
import * as sounds from '@util/db/Sounds';
import { getPathForSound } from '@util/SoundUtil';
import QueueItem from './QueueItem';

export default class SoundQueue {
  private readonly config: Config;

  private queue: QueueItem[] = [];
  private currentSound: QueueItem | null = null;
  private dispatcher: StreamDispatcher | null = null;

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

    this.dispatcher.emit('end');
  }

  public clear() {
    if (!this.currentSound) return;
    if (this.config.deleteMessages) this.deleteMessages();

    // Prevent further looping
    this.currentSound.count = 0;
    this.queue = [];
  }

  private isStartable() {
    return this.currentSound === null;
  }

  private deleteMessages() {
    if (this.isEmpty()) return;

    let deleteableMessages = this.queue
      .map(item => item.message)
      .filter((message): message is Message => !!message);

    if (this.currentSound!.message) {
      deleteableMessages = deleteableMessages.filter(
        message => message.id !== this.currentSound!.message!.id
      );
    }

    // Do not try to delete the same sound multiple times (!combo)
    Array.from(new Set(deleteableMessages)).forEach(message => message.delete());
  }

  private playNext() {
    this.currentSound = this.queue.shift()!;
    const sound = getPathForSound(this.currentSound.name);

    this.currentSound.channel
      .join()
      .then(connection => this.deafen(connection))
      .then(connection => this.playSound(connection, sound))
      .then(connection => this.onFinishedPlayingSound(connection))
      .catch(error => console.error('Error occured!', '\n', error));
  }

  private deafen(connection: VoiceConnection) {
    // Can only deafen when in a channel, therefore need connection
    if (connection.voice.selfDeaf !== this.config.deafen) {
      connection.voice.setDeaf(this.config.deafen);
    }

    return Promise.resolve(connection);
  }

  private playSound(connection: VoiceConnection, name: string): Promise<VoiceConnection> {
    return new Promise(resolve => {
      this.dispatcher = connection
        .play(name, { volume: this.config.volume })
        .on('end', () => resolve(connection));
    });
  }

  private onFinishedPlayingSound(connection: VoiceConnection) {
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

    if (!this.config.stayInChannel) connection.disconnect();
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

    return message.channel.messages.find(msg => msg.id === message.id) === null;
  }

  private isLastSoundFromCurrentMessage(message: Message) {
    return !this.queue.some(item => !!item.message && item.message.id === message.id);
  }
}
