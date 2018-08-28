import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';
import SoundUtil from '../../util/SoundUtil';
import MessageChunker from '../helpers/MessageChunker';

export default class TagsCommand implements ICommand {
  public readonly TRIGGERS = ['tags'];
  private readonly db: DatabaseAdapter;
  private readonly chunker: MessageChunker;

  constructor(db: DatabaseAdapter, chunker: MessageChunker) {
    this.db = db;
    this.chunker = chunker;
  }

  public run(message: Message, params: Array<string>) {
    const sounds = SoundUtil.getSounds();
    const soundsWithTags = this.formattedMessage(sounds);

    this.chunker.chunkedMessages(soundsWithTags, params)
                .forEach(chunk => message.author.send(chunk));
  }

  private formattedMessage(sounds: Array<string>) {
    const longestSoundLength = this.findLongestWord(sounds).length;
    return sounds.map(sound => this.listSoundWithTags(sound, longestSoundLength));
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
