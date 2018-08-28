import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';

export default class MostPlayedCommand implements ICommand {
  public readonly TRIGGERS = ['mostplayed'];
  private db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  public run(message: Message) {
    message.channel.send(this.getMostPlayedSounds());
  }

  private getMostPlayedSounds() {
    const sounds = this.db.getMostPlayedSounds();
    const longestSoundLength = this.findLongestWord(sounds.map(sound => sound.name)).length;
    const longestCountLength = this.findLongestWord(sounds.map(sound => String(sound.count))).length;
    return this.formatMessage(sounds, longestSoundLength, longestCountLength);
  }

  private findLongestWord(array: Array<string>) {
    return array.reduce((a, b) => a.length > b.length ? a : b);
  }

  private formatMessage(sounds: Array<{ name: string, count: number }>,
                        longestSoundLength: number,
                        longestCountLength: number) {
    const message = ['```'];
    sounds.forEach(sound => {
      const spacesForSound = ' '.repeat(longestSoundLength - sound.name.length + 1);
      const spacesForCount = ' '.repeat(longestCountLength - String(sound.count).length);
      message.push(`${sound.name}:${spacesForSound}${spacesForCount}${sound.count}`);
    });
    message.push('```');
    return message.join('\n');
  }
}
