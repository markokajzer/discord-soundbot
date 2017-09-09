const config = require('config');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/file-async');
const SoundBot = require('./src/SoundBot.js');

const db = low('db.json', { storage: fileAsync });
db.defaults({ counts: [], ignoreList: [] }).value();

const bot = new SoundBot();
bot.start();

const message = [
  'Use the following URL to let the bot join your server!',
  `https://discordapp.com/oauth2/authorize?client_id=${config.get('client_id')}&scope=bot`
].join('\n');

console.log(message); // eslint-disable-line no-console
