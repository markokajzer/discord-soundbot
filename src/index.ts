import container from '@util/Container';

import Config from '@config/Config';
import ConfigInterface from '@config/ConfigInterface';
import localize from '@util/i18n/localize';
import Command from './bot/commands/base/Command';
import SoundBot from './bot/SoundBot';

class DiscordSoundBot {
  private readonly config: Config;
  private readonly bot: SoundBot;

  constructor(config: ConfigInterface, commands: Command[] = []) {
    this.config = container.config;
    this.bot = container.soundBot;

    this.initializeWith(config, commands);
  }

  public start() {
    this.bot.start();
    console.info(localize.t('url', { clientId: this.config.clientId }));
  }

  private initializeWith(config: ConfigInterface, commands: Command[]) {
    this.config.setFrom(config);
    localize.setLocale(this.config.language);

    this.bot.registerAdditionalCommands(commands);
  }
}

export = DiscordSoundBot;
