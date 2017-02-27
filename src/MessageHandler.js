const Util = require('./Util.js');

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
  }

  handle(message) {
    if (message.content === '!commands') {
      message.author.sendMessage(Util.commandsList());
    } else if (message.content === '!mostplayed') {
      message.channel.sendMessage(Util.mostPlayedList());
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
        message.author.sendMessage(sounds.map(sound => sound));
      } else {
        const voiceChannel = message.member.voiceChannel;
        if (voiceChannel === undefined) {
          message.reply('Join a voice channel first!');
        } else if (message.content === '!stop') {
          voiceChannel.leave();
          this.bot.queue = [];
        } else if (message.content === '!random') {
          const random = sounds[Math.floor(Math.random() * sounds.length)];
          this.bot.addToQueue(voiceChannel.id, random, message);
        } else {
          const sound = message.content.split('!')[1];
          if (sounds.includes(sound)) {
            this.bot.addToQueue(voiceChannel.id, sound, message);
            if (this.bot.voiceConnections.array().length === 0) this.bot.playSoundQueue();
          }
        }
      }
    }
  }
}

module.exports = MessageHandler;
