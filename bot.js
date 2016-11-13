const config = require('config');
const fs = require('fs');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/file-async');
const Discord = require('discord.js');

const db = low('db.json', { storage: fileAsync });
db.defaults({ counts: [] }).value();

const bot = new Discord.Client();
let queue = [];

bot.on('message', (message) => {
  // Abort when PM
  if (message.channel instanceof Discord.DMChannel)
    return;

  // Only listen for messages starting with '!'
  if (!message.content.startsWith('!'))
    return;

  // Show list of commands
  if (message.content === '!commands') {
    listCommands(message.author);
    return;
  }

  // Show number of times the sounds have been played
  if (message.content === '!mostplayed') {
    listMostPlayed(message.channel.id);
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
  if (voiceChannel === undefined) {
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
    addToQueue(voiceChannel, random);
    return;
  }

  // Add sound to queue if exists
  const sound = message.content.split('!')[1];
  if (sounds.includes(sound)) {
    addToQueue(voiceChannel, sound);

    // Work through queue
    if (bot.voiceConnections.array().length === 0)
      playSoundQueue();
  }
});

function listCommands(user) {
  const message = [
    '```',
    '!commands         Show this message',
    '!sounds           Show available sounds',
    '!mostplayed       Show 15 most used sounds',
    '!<sound>          Play the specified sound',
    '!random           Play random sound',
    '!stop             Stop playing and clear queue',
    '!remove <sound>   Remove specified sound',
    '```'
  ];
  user.sendMessage(message.join('\n'));
}

function listMostPlayed(channelId) {
  const sounds = db.get('counts').sortBy('count').reverse().take(15).value();
  const message = ['```'];

  const longestSound = findLongestWord(sounds.map(sound => sound.name));
  const longestCount = findLongestWord(sounds.map(sound => String(sound.count)));

  sounds.forEach((sound) => {
    const spacesForSound = ' '.repeat(longestSound.length - sound.name.length + 1);
    const spacesForCount = ' '.repeat(longestCount.length - String(sound.count).length);
    message.push(`${sound.name}:${spacesForSound}${spacesForCount}${sound.count}`);
  });
  message.push('```');
  bot.channels.get(channelId).sendMessage(message.join('\n'));
}

function findLongestWord(array) {
  let indexOfLongestWord = 0;
  for (let i = 1; i < array.length; i++)
    if (array[indexOfLongestWord].length < array[i].length) indexOfLongestWord = i;
  return array[indexOfLongestWord];
}

function listAvailableSounds(sounds, user) {
  const message = sounds.map(sound => sound);
  user.sendMessage(message);
}

function removeSound(sound) {
  const file = `sounds/${sound}.mp3`;
  fs.unlink(file);
}

function addToQueue(voiceChannel, sound) {
  queue.push({ name: sound, channel: voiceChannel.id });
}

function playSoundQueue() {
  const nextSound = queue.shift();
  const file = `sounds/${nextSound.name}.mp3`;
  const voiceChannel = bot.channels.get(nextSound.channel);

  voiceChannel.join().then((connection) => {
    const dispatcher = connection.playFile(file);
    dispatcher.on('end', () => {
      updateCount(nextSound.name);

      if (queue.length > 0)
        playSoundQueue();
      else
        connection.disconnect();
    });
  }).catch((error) => {
    console.log('Error occured!');
    console.log(error);
  });
}

function updateCount(playedSound) {
  const sound = db.get('counts').find({ name: playedSound }).value();
  if (sound) {
    db.get('counts').find({ name: playedSound }).value().count =
      db.get('counts').find({ name: playedSound }).value().count + 1;
    db.write();
  } else {
    db.get('counts').push({ name: playedSound, count: 1 }).value();
  }
}

bot.login(config.get('token'));

console.log('Use the following URL to let the bot join your server!');
console.log(`https://discordapp.com/oauth2/authorize?client_id=${config.get('client_id')}&scope=bot`);
