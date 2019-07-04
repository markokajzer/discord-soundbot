import { Message } from 'discord.js';

import * as soundsDb from '@util/db/Sounds';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';
import MessageChunker from './helpers/MessageChunker';

export default class TagsCommand implements Command {
  public readonly TRIGGERS = ['tags'];

  private readonly chunker: MessageChunker;

  constructor(chunker: MessageChunker) {
    this.chunker = chunker;
  }

  public run(message: Message, params: string[]) {
    const sounds = getSounds();
    const soundsWithTags = this.formattedMessage(sounds);

    const page = parseInt(params[0]);

    this.chunker.chunkedMessages(soundsWithTags, page)
      .forEach(chunk => message.author.send(chunk));
  }

  private formattedMessage(sounds: string[]) {
    const longestSound = this.findLongestWord(sounds);
    return sounds.map(sound => this.listSoundWithTags(sound, longestSound.length));
  }

  private listSoundWithTags(sound: string, soundLength: number) {
    const tags = soundsDb.listTags(sound);
    if (!tags.length) return sound;

    const spacesForSound = ' '.repeat(soundLength - sound.length + 1);
    return `${sound}:${spacesForSound}${tags.join(', ')}`;
  }

  private findLongestWord(array: string[]) {
    return array.reduce((a, b) => a.length > b.length ? a : b);
  }
}
