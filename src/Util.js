const config = require('config');
const fs = require('fs');
const https = require('https');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/file-async');

class Util {
  constructor() {
    this.db = low('db.json', { storage: fileAsync });
  }

  getSoundsWithExtension() {
    const files = fs.readdirSync('sounds/');
    let sounds = files.filter(sound => config.get('extensions').some(ext => sound.endsWith(ext)));
    sounds = sounds.map(sound => ({ name: sound.split('.')[0], extension: sound.split('.')[1] }));
    return sounds;
  }

  getSounds() {
    const sounds = this.getSoundsWithExtension();
    return sounds.map(sound => sound.name);
  }

  getExtensionForSound(name) {
    return this.getSoundsWithExtension().find(sound => sound.name === name).extension;
  }

  getPathForSound(sound) {
    return `sounds/${sound}.${this.getExtensionForSound(sound)}`;
  }

  commandsList() {
    return [
      '```',
      '!commands              Show this message',
      '!sounds                Show available sounds',
      '!mostplayed            Show 15 most used sounds',
      '!<sound>               Play the specified sound',
      '!random                Play random sound',
      '!stop                  Stop playing and clear queue',
      '!add                   Add the attached sound',
      '!rename <old> <new>    Rename specified sound',
      '!remove <sound>        Remove specified sound',
      '```'
    ].join('\n');
  }

  mostPlayedList() {
    const sounds = this.db.get('counts').sortBy('count').reverse().take(15).value();
    const message = ['```'];

    const longestSound = this._findLongestWord(sounds.map(sound => sound.name));
    const longestCount = this._findLongestWord(sounds.map(sound => String(sound.count)));

    sounds.forEach((sound) => {
      const spacesForSound = ' '.repeat(longestSound.length - sound.name.length + 1);
      const spacesForCount = ' '.repeat(longestCount.length - String(sound.count).length);
      message.push(`${sound.name}:${spacesForSound}${spacesForCount}${sound.count}`);
    });
    message.push('```');
    return message.join('\n');
  }

  _findLongestWord(array) {
    let indexOfLongestWord = 0;
    for (let i = 1; i < array.length; i++)
      if (array[indexOfLongestWord].length < array[i].length) indexOfLongestWord = i;
    return array[indexOfLongestWord];
  }

  addSounds(attachments, channel) {
    attachments.forEach(attachment => this._addSound(attachment, channel));
  }

  _addSound(attachment, channel) {
    if (attachment.filesize > config.get('size')) {
      channel.sendMessage(`${attachment.filename.split('.')[0]} is too big!`);
      return;
    }

    if (!config.get('extensions').some(ext => attachment.filename.endsWith(ext))) {
      channel.sendMessage('Sound has to be in accepted format!');
      return;
    }

    const filename = attachment.filename.split('.')[0];
    if (this.getSounds().includes(filename)) {
      channel.sendMessage(`${filename} already exists!`);
      return;
    }

    https.get(attachment.url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(`./sounds/${attachment.filename}`);
        response.pipe(file);
        channel.sendMessage(`${filename} added!`);
      }
    }).on('error', (error) => {
      console.error(error);
      channel.sendMessage('Something went wrong!');
    });
  }

  renameSound(oldName, newName, channel) {
    const extension = this.getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;
    try {
      fs.renameSync(oldFile, newFile);
      channel.sendMessage(`${oldName} renamed to ${newName}!`);
    } catch (error) {
      channel.sendMessage(`${oldName} not found!`);
    }
  }

  removeSound(sound, channel) {
    try {
      const file = this.getPathForSound(sound);
      fs.unlinkSync(file);
      channel.sendMessage(`${sound} removed!`);
    } catch (error) {
      channel.sendMessage(`${sound} not found!`);
    }
  }

  updateCount(playedSound) {
    const sound = this.db.get('counts').find({ name: playedSound }).value();
    if (sound) {
      this.db.get('counts').find({ name: playedSound }).value().count =
        this.db.get('counts').find({ name: playedSound }).value().count + 1;
      this.db.write();
    } else {
      this.db.get('counts').push({ name: playedSound, count: 1 }).value();
    }
  }
}

module.exports = new Util();
