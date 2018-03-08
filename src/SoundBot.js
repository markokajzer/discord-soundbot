const config = require('config');
const Discord = require('discord.js');
const Util = require('./Util.js');

require('./Message.js');

class SoundBot extends Discord.Client {
  constructor() {
    super();

    this.prefix = config.get('prefix');
    this.speaking = false;
    this.queue = [];

    this._addEventListeners();
  }

  start() {
    this.login(config.get('token'));
  }

  _addEventListeners() {
    this.on('ready', this._readyListener);
    this.on('message', this._messageListener);
  }

  _readyListener() {
    this._setActivity();
    this._setAvatar();
  }

  _setActivity() {
    this.user.setActivity(config.get('game'));
  }

  _setAvatar() {
    const avatar = Util.avatarExists() ? './config/avatar.png' : null;
    this.user.setAvatar(avatar);
  }

  _messageListener(message) {
    if (message.isDirectMessage()) return;
    if (!message.hasPrefix(this.prefix)) return;
    if (Util.userIgnored(message.author.id)) return;

    message.content = message.content.substring(this.prefix.length);
    this._handle(message);
  }

  _handle(message) {
    const [command, ...input] = message.content.split(' ');
    switch (command) {
      case 'commands':
        message.author.send(Util.getListOfCommands());
        break;
      case 'sounds':
        message.author.send(Util.getSounds().map(sound => sound));
        break;
      case 'mostplayed':
        message.channel.send(Util.getMostPlayedSounds());
        break;
      case 'lastadded':
        message.channel.send(['```', ...Util.lastAdded(), '```'].join('\n'));
        break;
      case 'add':
        if (message.attachments) Util.addSounds(message.attachments, message.channel);
        break;
      case 'rename':
        Util.renameSound(input, message.channel);
        break;
      case 'remove':
        Util.removeSound(input, message.channel);
        break;
      case 'ignore':
        Util.ignoreUser(input, message);
        break;
      case 'unignore':
        Util.unignoreUser(input, message);
        break;
      default:
        this._handleSoundCommands(message);
        break;
    }
  }

  _handleSoundCommands(message) {
    const sounds = Util.getSounds();
    const voiceChannel = message.member.voiceChannel;

    if (voiceChannel === undefined) {
      message.reply('Join a voice channel first!');
      return;
    }

    switch (message.content) {
      case 'leave':
      case 'stop':
        voiceChannel.leave();
        this.queue = [];
        break;
      case 'random':
        const random = sounds[Math.floor(Math.random() * sounds.length)];
        this._addToQueue(voiceChannel.id, random, message);
        break;
      default:
        const sound = message.content;
        if (sounds.includes(sound)) {
          this._addToQueue(voiceChannel.id, sound, message);
          if (!this.speaking) this._playSoundQueue();
        }
        break;
    }
  }

  _addToQueue(voiceChannel, sound, message) {
    this.queue.push({ name: sound, channel: voiceChannel, message });
  }

  _playSoundQueue() {
    const nextSound = this.queue.shift();
    const file = Util.getPathForSound(nextSound.name);
    const voiceChannel = this.channels.get(nextSound.channel);

    this.speaking = true;

    voiceChannel.join().then((connection) => {
      connection.playFile(file).on('end', () => {
        Util.updateCount(nextSound.name);
        if (config.get('deleteMessages') === true) nextSound.message.delete();

        if (this.queue.length === 0) {
          this.speaking = false;
          if (!config.get('stayInChannel')) connection.disconnect();
          return;
        }

        this._playSoundQueue();
      });
    }).catch((error) => {
      console.log('Error occured!');
      console.log(error);
    });
  }
}

module.exports = SoundBot;
