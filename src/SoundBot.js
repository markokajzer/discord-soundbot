const config = require('config');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/file-async');
const Discord = require('discord.js');
const MessageHandler = require('./MessageHandler.js');
const Util = require('./Util.js');

class SoundBot extends Discord.Client {
  constructor() {
    super();
    this.queue = [];
    this.db = low('db.json', { storage: fileAsync });
    this.messageHandler = new MessageHandler(this);

    this.db.defaults({ counts: [] }).value();
    this.db.defaults({ joinSounds: [] }).value();
    this._addEventListeners();
    this.login(config.get('token'));
  }

  _addEventListeners() {
    this.on('voiceStateUpdate', this._voiceStateUpdateListener);
    this.on('message', this._messageListener);
  }

  // Play joinsound if joined a channel
  _voiceStateUpdateListener(oldMember, newMember) {
    // This is superbad, but db needs to be reevaluated
    // Without this we get the joinsound that was there during startup
    this.db = low('db.json', { storage: fileAsync });
    if (oldMember.id !== this.user.id &&
        ((oldMember.voiceChannelID === null && newMember.voiceChannelID !== null) ||
         (oldMember.voiceChannelID === this.guilds.first().afkChannelID)) &&
        this.db.get('joinSounds').find({ user: newMember.id }).value() !== undefined) {
      this.addToQueue(this.channels.get(newMember.voiceChannelID),
        this.db.get('joinSounds').find({ user: newMember.id }).value().sound);

      if (this.voiceConnections.array().length === 0)
        this.playSoundQueue();
    }
  }

  _messageListener(message) {
    if (message.channel instanceof Discord.DMChannel) return; // Abort when DM
    if (!message.content.startsWith('!')) return; // Abort when not prefix
    this.messageHandler.handle(message);
  }

  addToQueue(voiceChannel, sound) {
    this.queue.push({ name: sound, channel: voiceChannel.id });
  }

  playSoundQueue() {
    const nextSound = this.queue.shift();
    const file = `sounds/${nextSound.name}.mp3`;
    const voiceChannel = this.channels.get(nextSound.channel);

    voiceChannel.join().then((connection) => {
      const dispatcher = connection.playFile(file);
      dispatcher.on('end', () => {
        Util.updateCount(nextSound.name);

        if (this.queue.length > 0)
          this.playSoundQueue();
        else
          connection.disconnect();
      });
    }).catch((error) => {
      console.log('Error occured!');
      console.log(error);
    });
  }
}

module.exports = new SoundBot();
