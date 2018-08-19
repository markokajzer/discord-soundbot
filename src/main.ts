/* tslint:disable no-consecutive-blank-lines */

import config from '../config/config.json';

import SoundBot from './bot/SoundBot';
import CommandCollection from './commands/CommandCollection';
import * as Commands from './commands/Commands';
import AttachmentValidator from './commands/helpers/AttachmentValidator';
import SoundDownloader from './commands/helpers/SoundDownloader';
import UserFinder from './commands/helpers/UserFinder';
import VoiceChannelFinder from './commands/helpers/VoiceChannelFinder';
import DatabaseAdapter from './db/DatabaseAdapter';
import MessageChunker from './message/MessageChunker';
import MessageHandler from './message/MessageHandler';
import SoundQueue from './queue/SoundQueue';


const databaseAdapter = new DatabaseAdapter();
const soundQueue = new SoundQueue(databaseAdapter);

const validator = new AttachmentValidator();
const downloader = new SoundDownloader();
const voiceChannelFinder = new VoiceChannelFinder();
const messageChunker = new MessageChunker();
const userFinder = new UserFinder();

const commands = [
  new Commands.AddCommand(validator, downloader),
  new Commands.RenameCommand(databaseAdapter),
  new Commands.RemoveCommand(databaseAdapter),

  new Commands.SoundCommand(soundQueue, voiceChannelFinder),
  new Commands.RandomCommand(soundQueue, voiceChannelFinder),

  new Commands.SoundsCommand(messageChunker),
  new Commands.SearchCommand(databaseAdapter),
  new Commands.TagCommand(databaseAdapter),
  new Commands.TagsCommand(databaseAdapter, messageChunker),
  new Commands.DownloadCommand(),

  new Commands.StopCommand(soundQueue),

  new Commands.HelpCommand(),
  new Commands.LastAddedCommand(),
  new Commands.MostPlayedCommand(databaseAdapter),

  new Commands.IgnoreCommand(databaseAdapter, userFinder),
  new Commands.UnignoreCommand(databaseAdapter, userFinder)
];

const commandCollection = new CommandCollection(commands);
const messageHandler = new MessageHandler(commandCollection, databaseAdapter);


const bot = new SoundBot(commandCollection, messageHandler);
bot.start();

const message = [
  'Use the following URL to let the bot join your server!',
  `https://discordapp.com/oauth2/authorize?client_id=${config.clientID}&scope=bot`
].join('\n');
console.log(message);  // tslint:disable-line no-console
