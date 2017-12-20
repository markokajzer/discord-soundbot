const config = require('config');
const fs = require('fs');
const https = require('https');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');

class Util {
  constructor() {
    this.db = low(adapter);
    this.usage = {
      rename: 'Usage: !rename <old> <new>',
      remove: 'Usage: !remove <sound>',
      ignore: 'Usage: !ignore <user>',
      unignore: 'Usage: !unignore'
    };
  }

  avatarExists() {
    return fs.existsSync('./config/avatar.png');
  }

  getSounds() {
    const sounds = this._getSoundsWithExtension();
    return sounds.map(sound => sound.name);
  }

  _getSoundsWithExtension() {
    const files = fs.readdirSync('sounds/');
    let sounds = files.filter(sound => config.get('extensions').some(ext => sound.endsWith(ext)));
    sounds = sounds.map((sound) => {
      return { name: sound.split('.')[0], extension: sound.split('.')[1] };
    });
    return sounds;
  }

  getPathForSound(sound) {
    return `sounds/${sound}.${this._getExtensionForSound(sound)}`;
  }

  _getExtensionForSound(name) {
    return this._getSoundsWithExtension().find(sound => sound.name === name).extension;
  }

  getListOfCommands() {
    return [
      '```',
      `Use the prefix "${config.get('prefix')}" with the following commands:`,
      '',
      'commands              Show this message',
      'sounds                Show available sounds',
      'mostplayed            Show 15 most used sounds',
      'lastadded             Show 5 last added sounds',
      '<sound>               Play the specified sound',
      'random                Play random sound',
      'stop                  Stop playing and clear queue',
      'add                   Add the attached sound',
      'rename <old> <new>    Rename specified sound',
      'remove <sound>        Remove specified sound',
      'ignore <user>         Ignore specified user',
      'unignore <user>       Unignore specified user',
      '```'
    ].join('\n');
  }

  getMostPlayedSounds() {
    // eslint-disable-next-line
    const sounds = this.db.get('counts').sortBy('count').reverse().take(15).value();
    const longestSound = this._findLongestWord(sounds.map(sound => sound.name));
    const longestCount = this._findLongestWord(sounds.map(sound => String(sound.count)));

    const message = ['```'];
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
    for (let i = 1; i < array.length; i++) {
      if (array[indexOfLongestWord].length < array[i].length) indexOfLongestWord = i;
    }
    return array[indexOfLongestWord];
  }

  addSounds(attachments, channel) {
    attachments.forEach(attachment => this._addSound(attachment, channel));
  }

  _addSound(attachment, channel) {
    if (attachment.filesize > config.get('size')) {
      channel.send(`${attachment.filename.split('.')[0]} is too big!`);
      return;
    }

    if (!config.get('extensions').some(ext => attachment.filename.endsWith(ext))) {
      channel.send('Sound has to be in accepted format!');
      return;
    }

    const filename = attachment.filename.split('.')[0];
    if (this.getSounds().includes(filename)) {
      channel.send(`${filename} already exists!`);
      return;
    }

    https.get(attachment.url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(`./sounds/${attachment.filename}`);
        response.pipe(file);
        channel.send(`${filename} added!`);
      }
    }).on('error', () => channel.send('Something went wrong!'));
  }

  lastAdded() {
    let sounds = this._getSoundsWithExtension();
    sounds = sounds.map((sound) => {
      return {
        name: sound.name,
        creation: fs.statSync(this.getPathForSound(sound.name)).birthtime
      };
    });
    sounds = sounds.sort((a, b) => new Date(b.creation) - new Date(a.creation));
    sounds = sounds.slice(0, 5);
    return sounds.map(sound => sound.name);
  }


  renameSound(input, channel) {
    if (input.length !== 2) {
      channel.send(this.usage.rename);
      return;
    }

    const [oldName, newName] = input;
    const extension = this._getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;

    try {
      fs.renameSync(oldFile, newFile);
      channel.send(`${oldName} renamed to ${newName}!`);
    } catch (error) {
      channel.send(`${oldName} not found!`);
    }
  }

  removeSound(input, channel) {
    if (input.length !== 1) {
      channel.send(this.usage.remove);
      return;
    }

    try {
      const file = this.getPathForSound(input[0]);
      fs.unlinkSync(file);
      channel.send(`${input} removed!`);
    } catch (error) {
      channel.send(`${input} not found!`);
    }
  }

  ignoreUser(input, message) {
    if (input.length !== 1) {
      message.channel.send(this.usage.ignore);
      return;
    }

    this._ignoreSwitch('ignore', input, message);
  }

  unignoreUser(input, message) {
    if (input.length !== 1) {
      message.channel.send(this.usage.unignore);
      return;
    }

    this._ignoreSwitch('unignore', input, message);
  }

  _ignoreSwitch(command, input, message) {
    const id = input[0];
    const alreadyIgnored = this.userIgnored(id);
    let messageAddition = '';

    if (command === 'ignore' && !alreadyIgnored) {
      this.db.get('ignoreList').push({ id }).write();
    } else if (command === 'unignore') {
      this.db.get('ignoreList').remove({ id }).write();
      messageAddition += 'no longer ';
    }

    const name = message.guild.member(id);
    message.channel.send(`${name || id} ${messageAddition}ignored!`);
  }

  userIgnored(id) {
    const user = this.db.get('ignoreList').find({ id }).value();
    return !!user;
  }

  updateCount(playedSound) {
    const sound = this.db.get('counts').find({ name: playedSound }).value();

    if (!sound) {
      this.db.get('counts').push({ name: playedSound, count: 1 }).write();
      return;
    }

    const newValue = this.db.get('counts').find({ name: playedSound }).value().count + 1;
    this.db.get('counts').find({ name: playedSound }).assign({ count: newValue }).write();
  }
}

module.exports = new Util();
