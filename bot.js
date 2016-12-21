const config = require('config');
const fs = require('fs');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/file-async');
const Discord = require('discord.js');

const db = low('db.json', { storage: fileAsync });
db.defaults({ counts: [] }).value();
db.defaults({ joinSounds: [] }).value();

const bot = new Discord.Client();
let queue = [];

// Play recorded sound if joined a channel
bot.on('voiceStateUpdate', (oldMember, newMember) => {
  if (oldMember.id !== bot.user.id &&
      ((oldMember.voiceChannelID === null && newMember.voiceChannelID !== null) ||
       (oldMember.voiceChannelID === bot.guilds.first().afkChannelID)) &&
      db.get('joinSounds').find({ user: newMember.id }).value() !== undefined) {
    addToQueue(bot.channels.get(newMember.voiceChannelID),
      db.get('joinSounds').find({ user: newMember.id }).value().sound);
    if (bot.voiceConnections.array().length === 0) playSoundQueue();
  }
});

bot.on('message', (message) => {
  // Abort when PM
  if (message.channel instanceof Discord.DMChannel)
    return;

  // Only listen for messages starting with '!'
  if (!message.content.startsWith('!'))
    return;

  // Show list of commands
  if (message.content === '!commands') {
    message.author.sendMessage(commandsList());
    return;
  }

  // Show number of times the sounds have been played
  if (message.content === '!mostplayed') {
    message.channel.sendMessage(mostPlayedList());
    return;
  }

  // Get stored sounds
  let sounds = fs.readdirSync('sounds/');
  sounds = sounds.filter(sound => sound.includes('.mp3'));
  sounds = sounds.map(sound => sound.split('.')[0]);

  // Show list of available sounds
  if (message.content === '!sounds') {
    message.author.sendMessage(sounds.map(sound => sound));
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

  // Set as JoinSound if exists
  if (message.content.startsWith('!joinsound ')) {
    const sound = message.content.replace('!joinsound ', '');
    if (sounds.includes(sound))
      setJoinSound(message.author, sound);
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

function commandsList() {
  return [
    '```',
    '!commands         Show this message',
    '!sounds           Show available sounds',
    '!mostplayed       Show 15 most used sounds',
    '!<sound>          Play the specified sound',
    '!random           Play random sound',
    '!stop             Stop playing and clear queue',
    '!remove <sound>   Remove specified sound',
    '```'
  ].join('\n');
}

function mostPlayedList() {
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
  return message.join('\n');
}

function findLongestWord(array) {
  let indexOfLongestWord = 0;
  for (let i = 1; i < array.length; i++)
    if (array[indexOfLongestWord].length < array[i].length) indexOfLongestWord = i;
  return array[indexOfLongestWord];
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

function setJoinSound(joinUser, joinSound) {
  const user = db.get('joinSounds').find({ user: joinUser.id }).value();
  if (user)
    db.get('joinSounds').find({ user: joinUser.id }).assign({ sound: joinSound }).value();
  else
    db.get('joinSounds').push({ user: joinUser.id, sound: joinSound }).value();
}

bot.login(config.get('token'));

console.log('Use the following URL to let the bot join your server!');
console.log(`https://discordapp.com/oauth2/authorize?client_id=${config.get('client_id')}&scope=bot`);
