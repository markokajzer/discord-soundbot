const config = require('config');
const fs = require('fs');
const Discord = require('discord.js');

console.log('Use the following URL to let the bot join your server!');
console.log(`https://discordapp.com/oauth2/authorize?client_id=${config.get('client_id')}&scope=bot`);

const bot = new Discord.Client();
let queue = [];

bot.login(config.get('token'));

bot.on('message', (message) => {
  // Abort when PM
  if (message.channel instanceof Discord.DMChannel) {
    return;
  }

  // Only listen for messages starting with '!'
  if (!message.content.startsWith('!')) {
    return;
  }

  // Show list of commands
  if (message.content === '!commands') {
    listCommands(message.author);
    return;
  }

  // Get stored sounds
  let sounds = fs.readdirSync('sounds/');
  sounds = sounds.filter(sound => sound.includes('.mp3'));
  sounds = sounds.map(sound => sound.split('.')[0]);

  // Show list of available sounds
  if (message.content === '!sounds') {
    listAvailableSounds(sounds, message.author);
    return;
  }

  // Remove specified sound
  if (message.content.startsWith('!remove ')) {
    const sound = message.content.replace('!remove ', '');
    if (sounds.includes(sound)) {
      removeSound(sound);
      message.channel.sendMessage(`${sound} removed!`);
    } else {
      message.channel.sendMessage(`${sound} not found!`);
    }
    return;
  }

  const voiceChannel = message.member.voiceChannel;

  // Abort if user is not connected to any voice channel
  if (voiceChannel === null) {
    message.reply('Join a voice channel first!');
    return;
  }

  // Stop playing and clear queue
  if (message.content === '!stop') {
    voiceChannel.leave();
    queue = [];
    return;
  }

  // Play random sound
  if (message.content === '!random') {
    const random = sounds[Math.floor(Math.random() * sounds.length)];
    playSound(voiceChannel, random);
    return;
  }

  // Play it if sound specified and exists
  const sound = message.content.split('!')[1];
  if (sounds.includes(sound)) {
    playSound(voiceChannel, sound);
  }
});

function listCommands(user) {
  const message = [
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
  const message = sounds.map(sound => sound);
  user.sendMessage(message);
}

function removeSound(sound) {
  const file = `sounds/${sound}.mp3`;
  fs.unlink(file);
}

function playNext(connection) {
  // Play one sound of queue
  const file = queue.shift();
  const dispatcher = connection.playFile(file);
  dispatcher.on('end', () => {
    if (queue.length > 0) {
      playNext(connection);
    } else {
      connection.disconnect();
    }
  });
}

function playSound(voiceChannel, sound) {
  const file = `sounds/${sound}.mp3`;
  queue.push(file);
  voiceChannel.join().then((connection) => {
    // Disallow interruption of sounds, add to queue only instead
    if (connection.speaking) {
      return;
    }

    // Work through queue
    playNext(connection);
  }).catch((error) => {
    console.log('Error occured!');
    console.log(error);
  });
}
