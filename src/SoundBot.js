const config = require('config');
const Discord = require('discord.js');
const Util = require('./Util.js');

class SoundBot extends Discord.Client {
  constructor() {
    super();

    this.queue = [];
    this._addEventListeners();
  }

  _addEventListeners() {
    this.on('ready', this._readyListener);
    this.on('message', this._messageListener);
  }

  _readyListener() {
    const avatar = Util.avatarExists() ? './config/avatar.png' : null;
    this.user.setAvatar(avatar);
  }

  _messageListener(message) {
    if (message.channel instanceof Discord.DMChannel) return; // Abort when DM
    if (!message.content.startsWith('!')) return; // Abort when not prefix
    this.handle(message);
  }

  start() {
    this.login(config.get('token'));
  }

  handle(message) {
    if (message.content === '!commands') {
      message.author.send(Util.getListOfCommands());
    } else if (message.content === '!mostplayed') {
      message.channel.send(Util.getMostPlayedSounds());
    } else if (message.content === '!add' && message.attachments.size > 0) {
      Util.addSounds(message.attachments, message.channel);
    } else if (message.content.startsWith('!remove ')) {
      const sound = message.content.replace('!remove ', '');
      Util.removeSound(sound, message.channel);
    } else if (message.content.startsWith('!rename ')) {
      const [oldsound, newsound] = message.content.replace('!rename ', '').split(' ');
      Util.renameSound(oldsound, newsound, message.channel);
    } else {
      const sounds = Util.getSounds();
      if (message.content === '!sounds') {
        message.author.send(sounds.map(sound => sound));
      } else {
        const voiceChannel = message.member.voiceChannel;
        if (voiceChannel === undefined) {
          message.reply('Join a voice channel first!');
        } else if (message.content === '!stop') {
          voiceChannel.leave();
          this.queue = [];
        } else if (message.content === '!random') {
          const random = sounds[Math.floor(Math.random() * sounds.length)];
          this.addToQueue(voiceChannel.id, random, message);
        } else {
          const sound = message.content.split('!')[1];
          if (sounds.includes(sound)) {
            this.addToQueue(voiceChannel.id, sound, message);
            if (this.voiceConnections.array().length === 0) this.playSoundQueue();
          }
        }
      }
    }
  }

  addToQueue(voiceChannel, sound, message) {
    this.queue.push({ name: sound, channel: voiceChannel, message });
  }

  playSoundQueue() {
    const nextSound = this.queue.shift();
    const file = Util.getPathForSound(nextSound.name);
    const voiceChannel = this.channels.get(nextSound.channel);

    voiceChannel.join().then((connection) => {
      const dispatcher = connection.playFile(file);
      dispatcher.on('end', () => {
        Util.updateCount(nextSound.name);
        if (config.get('deleteMessages') === true) nextSound.message.delete();

        if (this.queue.length === 0) {
          connection.disconnect();
          return;
        }

        this.playSoundQueue();
      });
    }).catch((error) => {
      console.log('Error occured!');
      console.log(error);
    });
  }
}

module.exports = SoundBot;
