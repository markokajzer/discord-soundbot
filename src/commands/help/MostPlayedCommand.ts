import { Message } from 'discord.js';

import Sound from '~/util/db/models/Sound';
import * as soundsDb from '~/util/db/Sounds';

import Command from '../base/Command';

export class MostPlayedCommand extends Command {
  public readonly triggers = ['mostplayed'];

  public run(message: Message) {
    const formattedMessage = this.getFormattedMessage();
    if (!formattedMessage) return;

    message.channel.send(formattedMessage);
  }

  private getFormattedMessage() {
    const sounds = soundsDb.mostPlayed();
    if (!sounds.length) return undefined;

    const longestSound = this.findLongestWord(sounds.map(sound => sound.name));
    const longestCount = this.findLongestWord(sounds.map(sound => String(sound.count)));
    return this.formatSounds(sounds, longestSound.length, longestCount.length);
  }

  private findLongestWord(array: string[]) {
    return array.reduce((a, b) => (a.length > b.length ? a : b));
  }

  private formatSounds(sounds: Sound[], soundLength: number, countLength: number) {
    const lines = sounds.map(sound => {
      const spacesForSound = ' '.repeat(soundLength - sound.name.length + 1);
      const spacesForCount = ' '.repeat(countLength - String(sound.count).length);
      return `${sound.name}:${spacesForSound}${spacesForCount}${sound.count}`;
    });
    return ['```', ...lines, '```'].join('\n');
  }
}
