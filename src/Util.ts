import config from '../config/config.json';

import fs from 'fs';
import https from 'https';
import Discord from 'discord.js';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
const adapter = new FileSync('db.json');

class Util {
  private db: any;
  private readonly usage: any;

  constructor() {
    this.db = low(adapter);
    this.usage = {
      rename: 'Usage: !rename <old> <new>',
      remove: 'Usage: !remove <sound>',
      ignore: 'Usage: !ignore <user>',
      unignore: 'Usage: !unignore'
    };
  }

  public getSounds() {
    const sounds = this.getSoundsWithExtension();
    return sounds.map(sound => sound.name);
  }

  public getPathForSound(sound: string) {
    return `sounds/${sound}.${this.getExtensionForSound(sound)}`;
  }

  public getListOfCommands() {
    return [
      '```',
      `Use the prefix "${config.prefix}" with the following commands:`,
      '',
      'commands             Show this message',
      'sounds               Show available sounds',
      'mostplayed           Show 15 most used sounds',
      'lastadded            Show 5 last added sounds',
      '<sound>              Play the specified sound',
      'random               Play random sound',
      'stop                 Stop playing and clear queue',
      'leave                Leave the channel',
      'add                  Add the attached sound',
      'rename <old> <new>   Rename specified sound',
      'remove <sound>       Remove specified sound',
      'ignore <user>        Ignore specified user',
      'unignore <user>      Unignore specified user',
      '```'
    ].join('\n');
  }

  public getMostPlayedSounds() {
    const sounds: Array<{ name: string, count: number }> =
      this.db.get('counts').sortBy('count').reverse().take(15).value();
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

  public addSounds(message: Discord.Message) {
    message.attachments.forEach(attachment => {
      const result = this.addSound(attachment);
      message.channel.send(result);
    });
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

  public ignoreUser(message: Discord.Message, input: Array<string>) {
    if (input.length !== 1) {
      message.channel.send(this.usage.ignore);
      return;
    }

    const id = input[0];
    const user = message.guild.member(id);

    if (!user) {
      message.channel.send('User not found on this server.');
      return;
    }

    const alreadyIgnored = this.userIgnored(user);
    if (!alreadyIgnored) {
      this.db.get('ignoreList').push({ id: user.id }).write();
    }

    message.channel.send(`${user.displayName} ignored!`);
  }

  public unignoreUser(message: Discord.Message, input: Array<string>) {
    if (input.length !== 1) {
      message.channel.send(this.usage.unignore);
      return;
    }

    const id = input[0];
    const user = message.guild.member(id);

    if (!user) {
      message.channel.send('User not found on this server.');
      return;
    }

    this.db.get('ignoreList').remove({ id: user.id }).write();

    message.channel.send(`${user.displayName} no longer ignored!`);
  }

  public userIgnored(user: Discord.User | Discord.GuildMember) {
    const userToCheck = this.db.get('ignoreList').find({ id: user.id }).value();
    return !!userToCheck;
  }

  public updateCount(playedSound: string) {
    const sound = this.db.get('counts').find({ name: playedSound }).value();

    if (!sound) {
      this.db.get('counts').push({ name: playedSound, count: 1 }).write();
      return;
    }

    const newValue = this.db.get('counts').find({ name: playedSound }).value().count + 1;
    this.db.get('counts').find({ name: playedSound }).assign({ count: newValue }).write();
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

  private addSound(attachment: Discord.MessageAttachment) {
    if (attachment.filesize > config.maximumFileSize) {
      return `${attachment.filename.split('.')[0]} is too big!`;
    }

    const fileName = attachment.filename.toLowerCase();
    if (!config.acceptedExtensions.some(ext => fileName.endsWith(ext))) {
      const extensions = config.acceptedExtensions.join(', ');
      return `Sound has to be in accepted format, one of ${extensions}!`;
    }

    const soundName = fileName.split('.')[0];
    if (soundName.match(/[^a-z0-9]/)) {
      return 'Filename has to be in accepted format!';
    }

    if (this.getSounds().includes(soundName)) {
      return `${soundName} already exists!`;
    }

    https.get(attachment.url, response => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(`./sounds/${fileName}`);
        response.pipe(file);
        return `${soundName} added!`;
      }
    }).on('error', () => 'Something went wrong!');
  }
}

export default new Util();
