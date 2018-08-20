import * as awilix from 'awilix';

import SoundBot from '../bot/SoundBot';
import CommandCollection from '../commands/CommandCollection';
import * as Commands from '../commands/Commands';
import AttachmentValidator from '../commands/helpers/AttachmentValidator';
import MessageChunker from '../commands/helpers/MessageChunker';
import SoundDownloader from '../commands/helpers/SoundDownloader';
import UserFinder from '../commands/helpers/UserFinder';
import VoiceChannelFinder from '../commands/helpers/VoiceChannelFinder';
import DatabaseAdapter from '../db/DatabaseAdapter';
import i18n from '../i18n/i18n';
import LocaleService from '../i18n/LocaleService';
import MessageHandler from '../message/MessageHandler';
import SoundQueue from '../queue/SoundQueue';


const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC
});

container.register({
  i18nProvider: awilix.asValue(i18n),
  localeService: awilix.asClass(LocaleService).singleton(),

  db: awilix.asClass(DatabaseAdapter).singleton(),
  queue: awilix.asClass(SoundQueue).singleton(),

  validator: awilix.asClass(AttachmentValidator).singleton(),
  downloader: awilix.asClass(SoundDownloader).singleton(),
  voiceChannelFinder: awilix.asClass(VoiceChannelFinder).singleton(),

  chunker: awilix.asClass(MessageChunker).singleton(),
  userFinder: awilix.asClass(UserFinder).singleton(),
});

container.register({
  addCommand: awilix.asClass(Commands.AddCommand).singleton(),
  renameCommand: awilix.asClass(Commands.RenameCommand).singleton(),
  removeCommand: awilix.asClass(Commands.RemoveCommand).singleton(),

  soundCommand: awilix.asClass(Commands.SoundCommand).singleton(),
  randomCommand: awilix.asClass(Commands.RandomCommand).singleton(),

  soundsCommand: awilix.asClass(Commands.SoundsCommand).singleton(),
  searchCommand: awilix.asClass(Commands.SearchCommand).singleton(),
  tagCommand: awilix.asClass(Commands.TagCommand).singleton(),
  tagsCommand: awilix.asClass(Commands.TagsCommand).singleton(),
  downloadCommand: awilix.asClass(Commands.DownloadCommand).singleton(),

  stopCommand: awilix.asClass(Commands.StopCommand).singleton(),

  helpCommand: awilix.asClass(Commands.HelpCommand).singleton(),
  lastAddedCommand: awilix.asClass(Commands.LastAddedCommand).singleton(),
  mostPlayedCommand:  awilix.asClass(Commands.MostPlayedCommand).singleton(),
  ignoreCommand:  awilix.asClass(Commands.IgnoreCommand).singleton(),
  unignoreCommand:  awilix.asClass(Commands.UnignoreCommand).singleton(),

  avatarCommand:  awilix.asClass(Commands.AvatarCommand).singleton()
});

container.register({
  commands: awilix.asClass(CommandCollection).inject(() => ({
    commands: [
        container.cradle.addCommand,
        container.cradle.renameCommand,
        container.cradle.removeCommand,

        container.cradle.soundCommand,
        container.cradle.randomCommand,

        container.cradle.soundsCommand,
        container.cradle.searchCommand,
        container.cradle.tagCommand,
        container.cradle.tagsCommand,
        container.cradle.downloadCommand,

        container.cradle.stopCommand,

        container.cradle.helpCommand,
        container.cradle.lastAddedCommand,
        container.cradle.mostPlayedCommand,
        container.cradle.ignoreCommand,
        container.cradle.unignoreCommand,

        container.cradle.avatarCommand
    ]
  })),
  messageHandler: awilix.asClass(MessageHandler).singleton(),
  soundBot: awilix.asClass(SoundBot).singleton()
});

export default container;
