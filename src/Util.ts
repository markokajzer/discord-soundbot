import config from '../config/config.json';

import fs from 'fs';
import Discord from 'discord.js';

import Adapter from './db/Adapter';

class Util {
  public db: Adapter;
  private readonly usage: any;

  constructor() {
    this.db = new Adapter();
    this.usage = {
      rename: 'Usage: !rename <old> <new>',
      remove: 'Usage: !remove <sound>'
    };
  }

  public getSounds() {
    const sounds = this.getSoundsWithExtension();
    return sounds.map(sound => sound.name);
  }

  public getPathForSound(sound: string) {
    return `sounds/${sound}.${this.getExtensionForSound(sound)}`;
  }

  public getMostPlayedSounds() {
    const sounds = this.db.getMostPlayedSounds();

    const longestSound = this.findLongestWord(sounds.map(sound => sound.name));
    const longestCount = this.findLongestWord(sounds.map(sound => String(sound.count)));

    const message = ['```'];
    sounds.forEach(sound => {
      const spacesForSound = ' '.repeat(longestSound.length - sound.name.length + 1);
      const spacesForCount = ' '.repeat(longestCount.length - String(sound.count).length);
      message.push(`${sound.name}:${spacesForSound}${spacesForCount}${sound.count}`);
    });
    message.push('```');

    return message.join('\n');
  }

  public getLastAddedSounds() {
    const soundsWithExtension = this.getSoundsWithExtension();
    let lastAddedSounds = soundsWithExtension.map(sound => {
      return {
        name: sound.name,
        creation: fs.statSync(this.getPathForSound(sound.name)).birthtime
      };
    });
    lastAddedSounds = lastAddedSounds.sort((a, b) =>
      new Date(b.creation).valueOf() - new Date(a.creation).valueOf());
    lastAddedSounds = lastAddedSounds.slice(0, 5);
    return lastAddedSounds.map(sound => sound.name);
  }

  public renameSound(message: Discord.Message, input: Array<string>) {
    if (input.length !== 2) {
      message.channel.send(this.usage.rename);
      return;
    }

    const [oldName, newName] = input;
    const extension = this.getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;

    try {
      fs.renameSync(oldFile, newFile);
      message.channel.send(`${oldName} renamed to ${newName}!`);
    } catch (error) {
      message.channel.send(`${oldName} not found!`);
    }
  }

  public removeSound(message: Discord.Message, input: Array<string>) {
    if (input.length !== 1) {
      message.channel.send(this.usage.remove);
      return;
    }

    try {
      const file = this.getPathForSound(input[0]);
      fs.unlinkSync(file);
      message.channel.send(`${input} removed!`);
    } catch (error) {
      message.channel.send(`${input} not found!`);
    }
  }

  public isIgnoredUser(user: Discord.User) {
    const userToCheck = this.db.isIgnoredUser(user.id);
    return !!userToCheck;
  }

  public updateCount(playedSound: string) {
    this.db.updateSoundCount(playedSound);
  }

  private getSoundsWithExtension(): Array<{ name: string, extension: string }> {
    const files = fs.readdirSync('sounds/');
    const sounds = files.filter(sound => config.acceptedExtensions.some(ext => sound.endsWith(ext)));
    return sounds.map(sound => {
      return { name: sound.split('.')[0], extension: sound.split('.')[1] };
    });
  }

  private getExtensionForSound(name: string) {
    return this.getSoundsWithExtension().find(sound => sound.name === name)!.extension;
  }

  private findLongestWord(array: Array<string>) {
    let indexOfLongestWord = 0;
    for (let i = 1; i < array.length; i++) {
      if (array[indexOfLongestWord].length < array[i].length) indexOfLongestWord = i;
    }
    return array[indexOfLongestWord];
  }
}

export default new Util();
