import Config from '~/config/Config';
import ConfigInterface from '~/config/ConfigInterface';
import Container from '~/util/Container';
import localize from '~/util/i18n/localize';

import SoundBot from './bot/SoundBot';
import Command from './commands/base/Command';

class DiscordSoundBot {
  private readonly config: Config;
  private readonly bot: SoundBot;

  constructor(config: ConfigInterface, commands: Command[] = []) {
    this.config = Container.config;
    this.bot = Container.soundBot;

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
