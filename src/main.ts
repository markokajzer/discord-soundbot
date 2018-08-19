/* tslint:disable no-consecutive-blank-lines */

import config from '../config/config.json';

import SoundBot from './bot/SoundBot';
import CommandCollection from './commands/CommandCollection';
import * as Commands from './commands/Commands';
import AttachmentValidator from './commands/helpers/AttachmentValidator';
import MessageChunker from './commands/helpers/MessageChunker';
import SoundDownloader from './commands/helpers/SoundDownloader';
import UserFinder from './commands/helpers/UserFinder';
import VoiceChannelFinder from './commands/helpers/VoiceChannelFinder';
import DatabaseAdapter from './db/DatabaseAdapter';
import i18n from './i18n/i18n';
import LocaleService from './i18n/LocaleService';
import MessageHandler from './message/MessageHandler';
import SoundQueue from './queue/SoundQueue';


const localeService = new LocaleService(i18n);
localeService.setLocale(config.language);

const databaseAdapter = new DatabaseAdapter();
const soundQueue = new SoundQueue(databaseAdapter);

const validator = new AttachmentValidator(localeService);
const downloader = new SoundDownloader(localeService);
const voiceChannelFinder = new VoiceChannelFinder(localeService);
const messageChunker = new MessageChunker(localeService);
const userFinder = new UserFinder(localeService);

const commands = [
  new Commands.AddCommand(validator, downloader),
  new Commands.RenameCommand(localeService, databaseAdapter),
  new Commands.RemoveCommand(localeService, databaseAdapter),

  new Commands.SoundCommand(soundQueue, voiceChannelFinder),
  new Commands.RandomCommand(soundQueue, voiceChannelFinder),

  new Commands.SoundsCommand(localeService, messageChunker),
  new Commands.SearchCommand(localeService, databaseAdapter),
  new Commands.TagCommand(localeService, databaseAdapter),
  new Commands.TagsCommand(databaseAdapter, messageChunker),
  new Commands.DownloadCommand(),

  new Commands.StopCommand(soundQueue),

  new Commands.HelpCommand(localeService),
  new Commands.LastAddedCommand(),
  new Commands.MostPlayedCommand(databaseAdapter),

  new Commands.IgnoreCommand(localeService, databaseAdapter, userFinder),
  new Commands.UnignoreCommand(localeService, databaseAdapter, userFinder),

  new Commands.AvatarCommand(localeService)
];

const commandCollection = new CommandCollection(commands);
const messageHandler = new MessageHandler(commandCollection, databaseAdapter);


const bot = new SoundBot(localeService, commandCollection, messageHandler);
bot.start();
console.log(localeService.t('url', { clientId: config.clientID }));  // tslint:disable-line no-console
