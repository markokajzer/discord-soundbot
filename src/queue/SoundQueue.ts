import config from '../../config/config.json';

import QueueItem from './QueueItem';
import SoundUtil from '../util/SoundUtil';
import Util from '../Util';

export default class SoundQueue {
  private queue: Array<QueueItem>;
  private current: QueueItem | null;

  constructor() {
    this.queue = [];
    this.current = null;
  }

  public add(item: QueueItem) {
    this.queue.push(item);
    if (this.isStartable()) this.playNext();
  }

  public clear() {
    this.queue = [];
  }

  public isEmpty() {
    return this.queue.length === 0;
  }

  public getCurrent() {
    return this.current;
  }

  private isStartable() {
    return this.current === null;
  }

  private playNext() {
    this.current = this.shift();
    const file = SoundUtil.getPathForSound(this.current.sound);
    const voiceChannel = this.current.channel;

    voiceChannel.join().then(connection => {
      connection.playFile(file).on('end', () => {
        Util.updateCount(this.current!.sound);
        if (config.deleteMessages) this.current!.message.delete();

        this.current = null;
        if (!this.isEmpty()) this.playNext();
        if (this.isEmpty() && !config.stayInChannel) connection.disconnect();
      });
    }).catch(error => {
      console.error('Error occured!', '\n', error);
    });
  }

  private shift() {
    return this.queue.shift()!;
  }
}
