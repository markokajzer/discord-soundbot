/* tslint:disable no-consecutive-blank-lines */

import * as awilix from 'awilix';

import CommandCollection from '../bot/CommandCollection';
import DatabaseAdapter from '../db/DatabaseAdapter';
import i18n from '../i18n/i18n';
import LocaleService from '../i18n/LocaleService';
import SoundQueue from '../queue/SoundQueue';


const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC
});

container.register({
  i18nProvider: awilix.asValue(i18n),
  localeService: awilix.asClass(LocaleService).singleton(),

  db: awilix.asClass(DatabaseAdapter).singleton(),
  queue: awilix.asClass(SoundQueue).singleton(),

  validator: awilix.aliasTo('attachmentValidator'),
  downloader: awilix.aliasTo('soundDownloader'),
  chunker: awilix.aliasTo('messageChunker')
});

container.loadModules([
  'bot/*',
  'commands/helpers/*',
  'commands/soundbot/*'
], {
  cwd: 'dist/',
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: awilix.Lifetime.SINGLETON,
    register: awilix.asClass
  }
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

      container.cradle.welcomeCommand,
      container.cradle.helpCommand,
      container.cradle.lastAddedCommand,
      container.cradle.mostPlayedCommand,
      container.cradle.ignoreCommand,
      container.cradle.unignoreCommand,

      container.cradle.avatarCommand
    ]
  }))
});

export default container;
