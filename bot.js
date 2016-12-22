const config = require('config');

require('./src/SoundBot.js');

console.log('Use the following URL to let the bot join your server!');
console.log(
  `https://discordapp.com/oauth2/authorize?client_id=${config.get('client_id')}&scope=bot`
);
