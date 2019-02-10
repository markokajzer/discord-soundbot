import container from '@util/Container';

import Config from '@config/Config';
import ConfigInterface from '@config/ConfigInterface';
import LocaleService from '@util/i18n/LocaleService';
import Command from './bot/commands/base/Command';
import SoundBot from './bot/SoundBot';

class DiscordSoundBot {
  private readonly config: Config;
  private readonly localeService: LocaleService;
  private readonly bot: SoundBot;

  constructor(config: ConfigInterface, commands?: Command[]) {
    this.config = container.cradle.config;
    this.localeService = container.cradle.localeService;
    this.bot = container.cradle.soundBot;

    this.initializeWith(config, commands);
  }

  public start() {
    this.bot.start();
    console.info(this.localeService.t('url', { clientId: this.config.clientID }));
  }

  private initializeWith(config: ConfigInterface, commands?: Command[] | undefined) {
    this.config.setFrom(config);
    this.localeService.setLocale(this.config.language);

    if (commands) this.bot.registerAdditionalCommands(commands);
  }
}

export = DiscordSoundBot;
