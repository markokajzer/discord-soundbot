import * as awilix from 'awilix';

import path from 'path';

import Config from '@config/Config';
import SoundQueue from '@queue/SoundQueue';
import SoundBot from '../bot/SoundBot';
import CommandCollection from '../bot/CommandCollection';

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC
});

container.register({
  config: awilix.asClass(Config).singleton(),
  queue: awilix.asClass(SoundQueue).singleton()
});

container.loadModules(['bot/**/*.js'], {
  cwd: path.join(__dirname, '..'),
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: awilix.Lifetime.SINGLETON,
    register: awilix.asClass
  }
});

container.register({
  commands: awilix
    .asClass(CommandCollection)
    .singleton()
    .inject(() => ({
      commands: [
        container.cradle.pingCommand,

        container.cradle.addCommand,
        container.cradle.renameCommand,
        container.cradle.removeCommand,

        container.cradle.soundCommand,
        container.cradle.comboCommand,
        container.cradle.randomCommand,
        container.cradle.loopCommand,
        container.cradle.nextCommand,
        container.cradle.skipCommand,
        container.cradle.stopCommand,

        container.cradle.entranceCommand,
        container.cradle.exitCommand,

        container.cradle.soundsCommand,
        container.cradle.searchCommand,
        container.cradle.tagCommand,
        container.cradle.tagsCommand,
        container.cradle.downloadCommand,

        container.cradle.welcomeCommand,
        container.cradle.helpCommand,
        container.cradle.lastAddedCommand,
        container.cradle.mostPlayedCommand,
        container.cradle.ignoreCommand,
        container.cradle.unignoreCommand,

        container.cradle.avatarCommand,
        container.cradle.configCommand
      ]
    }))
});

interface SoundBotContainer {
  config: Config;
  soundBot: SoundBot;
}

export default container.cradle as SoundBotContainer;
