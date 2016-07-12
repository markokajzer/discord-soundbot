let config  = require('config'),
    fs      = require('fs'),
    Discord = require('discord.js');

console.log('Use the following URL to let the bot join your server!');
console.log(`https://discordapp.com/oauth2/authorize?client_id=${config.get('client_id')}&scope=bot`);

var bot = new Discord.Client();

bot.on('message', (message) => {
  // Only listen for messages starting with '!'
  if(!message.content.startsWith('!')) {
    return;
  }

  // Get stored sounds
  let sounds = fs.readdirSync('sounds/');
  sounds = sounds.filter((sound) => {
    return sound.indexOf('.mp3') >= 0;
  });
  sounds = sounds.map((sound) => {
    return sound.split('.')[0];
  });

  // List available sounds
  if(message.content === '!sounds') {
    listAvailableSounds(sounds, message.channel.id);
    return;
  }

  // Remove sounds
  if(message.content.startsWith('!remove ')) {
    let sound = message.content.replace('!remove ', '');
    if(sounds.includes(sound)) {
      removeSound(sound);
      bot.sendMessage(message.channel.id, `${sound} removed!`)
    }
    else {
      bot.sendMessage(message.channel.id, `${sound} not found!`)
    }
    return;
  }

  // Abort if user is not connected to any voice channel
  let voiceChannel = message.author.voiceChannel;
  if(voiceChannel === null) {
    return;
  }

  // Abort if users request was on another channel
  if(voiceChannel.server.id !== message.channel.server.id) {
    return;
  }

  // List available sounds
  if(message.content === '!random') {
    let random = sounds[Math.floor(Math.random() * sounds.length)];
    playSound(voiceChannel, random);
    return;
  }


  // If file sound exists, play it
  let sound = message.content.split('!')[1];
  if(sounds.includes(sound)) {
    playSound(voiceChannel, sound);
  }
});

function listAvailableSounds(sounds, channel) {
  let message = sounds.map((sound) => {
    return sound;
  });
  bot.sendMessage(channel, message);
}

function removeSound(sound, channel) {
  let file = `sounds/${sound}.mp3`;
  fs.unlink(file);
}

function playSound(voiceChannel, sound) {
  let file = `sounds/${sound}.mp3`;
  bot.joinVoiceChannel(voiceChannel, (error, connection) => {
    if(error) {
      console.log('Error occurred!');
      console.log(error);
    }
    else {
      connection.playFile(file, (_, intent) => {
        intent.on('end', () => {
          bot.leaveVoiceChannel(connection);
        });
      });
    }
  });
}

bot.loginWithToken(config.get('token'));
