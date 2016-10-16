const config  = require('config');
const fs      = require('fs');
const Discord = require('discord.js');

console.log('Use the following URL to let the bot join your server!');
console.log(`https://discordapp.com/oauth2/authorize?client_id=${config.get('client_id')}&scope=bot`);

const bot = new Discord.Client();
let queue = [];

bot.on('message', (message) => {
  // Abort when PM
  if(message.channel instanceof Discord.DMChannel) {
    return;
  }

  // Only listen for messages starting with '!'
  if(!message.content.startsWith('!')) {
    return;
  }

  // Show list of commands
  if(message.content === '!commands') {
    listCommands(message.author);
    return;
  }

  // Get stored sounds
  let sounds = fs.readdirSync('sounds/');
  sounds = sounds.filter((sound) => sound.includes('.mp3'));
  sounds = sounds.map((sound) => sound.split('.')[0]);

  // Show list of available sounds
  if(message.content === '!sounds') {
    listAvailableSounds(sounds, message.author);
    return;
  }

  // Remove specified sound
  if(message.content.startsWith('!remove ')) {
    let sound = message.content.replace('!remove ', '');
    if(sounds.includes(sound)) {
      removeSound(sound);
      message.channel.sendMessage(`${sound} removed!`);
    }
    else {
      message.channel.sendMessage(`${sound} not found!`);
    }
    return;
  }

  let voiceChannel = message.member.voiceChannel;

  // Abort if user is not connected to any voice channel
  if(voiceChannel === null) {
    return;
  }

  // Abort if users request was on another server
  if(voiceChannel.server.id !== message.channel.server.id) {
    return;
  }

  // Stop playing and clear queue
  if(message.content === '!stop') {
    voiceChannel.leave();
    queue = [];
    return;
  }

  // Play random sound
  if(message.content === '!random') {
    let random = sounds[Math.floor(Math.random() * sounds.length)];
    playSound(voiceChannel, random);
    return;
  }

  // Play it if sound specified and exists
  let sound = message.content.split('!')[1];
  if(sounds.includes(sound)) {
    playSound(voiceChannel, sound);
  }
});

function listCommands(user) {
  let message = [
    '```',
    '!commands         Show this message',
    '!sounds           Show available sounds',
    '!<sound>          Play the specified sound',
    '!random           Play random sound',
    '!stop             Stop playing',
    '!remove <sound>   Remove specified sound',
    '```'
  ];
  user.sendMessage(message.join('\n'));
}

function listAvailableSounds(sounds, user) {
  let message = sounds.map((sound) => sound);
  user.sendMessage(message);
}

function removeSound(sound) {
  let file = `sounds/${sound}.mp3`;
  fs.unlink(file);
}

function playNext(connection) {
  // Play one sound of queue
  let file = queue.shift();
  connection.playFile(file, (_, intent) => {
    intent.on('end', () => {
      if(queue.length > 0) {
        playNext(connection);
      }
      else {
        bot.leaveVoiceChannel(connection);
      }
    });
  });
}

function playSound(voiceChannel, sound) {
  let file = `sounds/${sound}.mp3`;
  queue.push(file);
  bot.joinVoiceChannel(voiceChannel, (error, connection) => {
    if(error) {
      console.log('Error occurred!');
      console.log(error);
      bot.leaveVoiceChannel(connection);
    }
    else {
      // Disallow interruption of sounds, add to queue instead
      if(connection.playing) {
        return;
      }

      // Work through queue
      playNext(connection);
    }
  });
}

bot.login(config.get('token'));
