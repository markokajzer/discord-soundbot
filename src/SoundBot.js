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
    this._addEventListeners();

    this.login(config.get('token'));
  }

  _addEventListeners() {
    this.on('message', this._messageListener);
  }

  _messageListener(message) {
    if (message.channel instanceof Discord.DMChannel) return; // Abort when DM
    if (!message.content.startsWith('!')) return; // Abort when not prefix
    this.messageHandler.handle(message);
  }

  addToQueue(voiceChannel, sound, messageTrigger) {
    this.queue.push({ name: sound, channel: voiceChannel, message: messageTrigger });
  }

  playSoundQueue() {
    const nextSound = this.queue.shift();
    const file = Util.getPathForSound(nextSound.name);
    const voiceChannel = this.channels.get(nextSound.channel);

    voiceChannel.join().then((connection) => {
      const dispatcher = connection.playFile(file);
      dispatcher.on('end', () => {
        Util.updateCount(nextSound.name);
        if (config.get('deleteMessages') === true)
          nextSound.message.delete();

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
