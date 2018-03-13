import config from '../config/config.json';

import DatabaseAdapter from './db/DatabaseAdapter';
import MessageHandler from './MessageHandler';
import SoundBot from './SoundBot';
import SoundQueue from './queue/SoundQueue';

const db = new DatabaseAdapter();
const queue = new SoundQueue(db);
const messageHandler = new MessageHandler(queue, db, config.prefix);
const bot = new SoundBot(messageHandler);
bot.start();

const message = [
  'Use the following URL to let the bot join your server!',
  `https://discordapp.com/oauth2/authorize?client_id=${config.clientID}&scope=bot`
].join('\n');
console.log(message);  // tslint:disable-line no-console
