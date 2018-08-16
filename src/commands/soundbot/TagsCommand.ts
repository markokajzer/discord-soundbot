import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';
import SoundUtil from '../../util/SoundUtil';

export default class TagsCommand implements ICommand {
  public readonly TRIGGERS = ['tags'];
  private readonly db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  public run(message: Message) {
    const sounds = SoundUtil.getSounds();
    const reply = this.formattedMessage(sounds, this.findLongestWord(sounds).length);

    message.author.send(reply);
  }

  private formattedMessage(sounds: Array<string>, longestSoundLength: number) {
    const message = ['```'];
    sounds.forEach(sound => message.push(this.listSoundWithTags(sound, longestSoundLength)));
    message.push('```');
    return message.join('\n');
  }

  private listSoundWithTags(sound: string, longestSoundLength: number): string {
    const tags = this.db.listTags(sound);
    if (!tags.length) return sound;

    const spacesForSound = ' '.repeat(longestSoundLength - sound.length + 1);
    return `${sound}:${spacesForSound}${tags.join(', ')}`;
  }

  private findLongestWord(array: Array<string>) {
    return array.reduce((a, b) => a.length > b.length ? a : b);
  }
}
