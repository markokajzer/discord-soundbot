import container from './di/DependencyGraph';

import Config from '@config/Config';
import ConfigInterface from '@config/ConfigInterface';
import LocaleService from '@util/i18n/LocaleService';
import SoundBot from './bot/SoundBot';

export default class DiscordSoundBot {
  private readonly config: Config;
  private readonly localeService: LocaleService;
  private readonly bot: SoundBot;

  constructor(config: ConfigInterface) {
    this.config = container.cradle.config as Config;
    this.localeService = container.cradle.localeService as LocaleService;
    this.bot = container.cradle.soundBot as SoundBot;
    this.initialize(config);
  }

  public start() {
    this.bot.start();
    console.info(this.localeService.t('url', { clientId: this.config.clientID }));
  }

  private initialize(config: ConfigInterface) {
    this.config.setFromObject(config);
    this.localeService.setLocale(this.config.language);
  }
}
