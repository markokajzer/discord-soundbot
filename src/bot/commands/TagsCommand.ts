import { Message } from 'discord.js';

import Command from './base/Command';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import SoundUtil from '@util/SoundUtil';
import MessageChunker from './helpers/MessageChunker';

export default class TagsCommand implements Command {
  public readonly TRIGGERS = ['tags'];

  private readonly soundUtil: SoundUtil;
  private readonly db: DatabaseAdapter;
  private readonly chunker: MessageChunker;

  constructor(soundUtil: SoundUtil, db: DatabaseAdapter, chunker: MessageChunker) {
    this.soundUtil = soundUtil;
    this.db = db;
    this.chunker = chunker;
  }

  public run(message: Message, params: string[]) {
    const sounds = this.soundUtil.getSounds();
    const soundsWithTags = this.formattedMessage(sounds);

    this.chunker.chunkedMessages(soundsWithTags, params)
                .forEach(chunk => message.author.send(chunk));
  }

  private formattedMessage(sounds: string[]) {
    const longestSound = this.findLongestWord(sounds);
    return sounds.map(sound => this.listSoundWithTags(sound, longestSound.length));
  }

  private listSoundWithTags(sound: string, soundLength: number) {
    const tags = this.db.sounds.listTags(sound);
    if (!tags.length) return sound;

    const spacesForSound = ' '.repeat(soundLength - sound.length + 1);
    return `${sound}:${spacesForSound}${tags.join(', ')}`;
  }

  private findLongestWord(array: string[]) {
    return array.reduce((a, b) => a.length > b.length ? a : b);
  }
}
