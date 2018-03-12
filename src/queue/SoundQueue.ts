import config from '../../config/config.json';

import QueueItem from './QueueItem';
import Util from '../Util';

export default class SoundQueue {
  private queue: Array<QueueItem>;

  constructor() {
    this.queue = [];
  }

  public add(item: QueueItem) {
    this.queue.push(item);
  }

  public isStartable() {
    return this.queue.length === 1;
  }

  public start() {
    this.playNext();
  }

  public clear() {
    this.queue.length = 0;
  }

  public isEmpty() {
    return this.queue.length === 0;
  }

  private playNext() {
    const next = this.next();
    const file = Util.getPathForSound(next.sound);
    const voiceChannel = next.channel;

    voiceChannel.join().then(connection => {
      connection.playFile(file).on('end', () => {
        Util.updateCount(next.sound);
        if (config.deleteMessages) next.message.delete();

        this.queue.shift();

        if (!this.isEmpty()) this.playNext();
        if (this.isEmpty() && !config.stayInChannel) connection.disconnect();
      });
    }).catch(error => {
      console.log('Error occured!');  // tslint:disable-line no-console
      console.log(error);             // tslint:disable-line no-console
    });
  }

  private next() {
    return this.queue[0];
  }
}
