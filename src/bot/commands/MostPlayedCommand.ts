import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import DatabaseAdapter from '../../util/db/DatabaseAdapter';
import Sound from '../../util/db/models/Sound';

export default class MostPlayedCommand implements ICommand {
  public readonly TRIGGERS = ['mostplayed'];
  private db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  public run(message: Message) {
    message.channel.send(this.getFormattedMessage());
  }

  private getFormattedMessage() {
    const sounds = this.db.sounds.mostPlayed();
    const longestSound = this.findLongestWord(sounds.map(sound => sound.name));
    const longestCount = this.findLongestWord(sounds.map(sound => String(sound.count)));
    return this.formatSounds(sounds, longestSound.length, longestCount.length);
  }

  private findLongestWord(array: Array<string>) {
    return array.reduce((a, b) => a.length > b.length ? a : b);
  }

  private formatSounds(sounds: Array<Sound>, soundLength: number, countLength: number) {
    const lines = sounds.map(sound => {
      const spacesForSound = ' '.repeat(soundLength - sound.name.length + 1);
      const spacesForCount = ' '.repeat(countLength - String(sound.count).length);
      return `${sound.name}:${spacesForSound}${spacesForCount}${sound.count}`;
    });
    return ['```', ...lines, '```'].join('\n');
  }
}
