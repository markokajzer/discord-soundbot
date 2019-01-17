import { VoiceConnection } from 'discord.js';

import Config from '@config/Config';
import DatabaseAdapter from '@util/db/DatabaseAdapter';
import SoundUtil from '@util/SoundUtil';
import QueueItem from './QueueItem';

export default class SoundQueue {
  private readonly config: Config;
  private readonly soundUtil: SoundUtil;
  private readonly db: DatabaseAdapter;

  private queue: QueueItem[];
  private currentSound: QueueItem | null;

  constructor(config: Config, soundUtil: SoundUtil, db: DatabaseAdapter) {
    this.config = config;
    this.soundUtil = soundUtil;
    this.db = db;
    this.queue = [];
    this.currentSound = null;
  }

  public add(item: QueueItem) {
    this.queue.push(item);
    if (this.isStartable()) this.playNext();
  }

  public clear() {
    if (!this.currentSound) return;
    if (this.config.deleteMessages) this.deleteMessages();

    this.queue = [];
  }

  private isStartable() {
    return this.currentSound === null;
  }

  private deleteMessages() {
    if (this.isEmpty()) return;

    this.queue
      .map(item => item.message)
      .filter(message => message)
      .filter(message => message && message.id !== this.currentSound!.message!.id)
      .filter((message, index, messages) => messages.indexOf(message) === index)
      .forEach(message => message!.delete());
  }

  private playNext() {
    this.currentSound = this.queue.shift()!;
    const sound = this.soundUtil.getPathForSound(this.currentSound.name);

    this.currentSound.channel.join()
      .then(connection => this.deafen(connection))
      .then(connection => this.playSound(connection, sound))
      .then(connection => this.onFinishedPlayingSound(connection))
      .catch(error => console.error('Error occured!', '\n', error));
  }

  private deafen(connection: VoiceConnection) {
    // Can only deafen when in a channel, therefore need connection
    connection.channel.guild.me.setDeaf(this.config.deafen);
    return Promise.resolve(connection);
  }

  private playSound(connection: VoiceConnection, name: string): Promise<VoiceConnection> {
    return new Promise(resolve =>
      connection.playFile(name, { volume: this.config.volume })
                .on('end', () => resolve(connection))
    );
  }

  private onFinishedPlayingSound(connection: VoiceConnection) {
    this.db.sounds.incrementCount(this.currentSound!.name);
    this.deleteCurrentMessage();

    if (!this.isEmpty()) {
      this.playNext();
      return;
    }

    this.currentSound = null;
    if (!this.config.stayInChannel) connection.disconnect();
  }

  private deleteCurrentMessage() {
    if (this.config.deleteMessages && this.currentSound!.message && this.isLastSoundFromCurrentMessage()) {
      this.currentSound!.message!.delete();
    }
  }

  private isLastSoundFromCurrentMessage() {
    return !this.queue.some(item => !!item.message && item.message.id === this.currentSound!.message!.id);
  }

  private isEmpty() {
    return this.queue.length === 0;
  }
}
