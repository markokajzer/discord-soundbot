import container from './di/DependencyGraph';

import Config from '@config/Config';
import LocaleService from '@util/i18n/LocaleService';
import SoundBot from './bot/SoundBot';

const config = container.cradle.config as Config;

const localeService = container.cradle.localeService as LocaleService;
localeService.setLocale(config.language);

const bot = container.cradle.soundBot as SoundBot;
bot.start();

console.info(localeService.t('url', { clientId: config.clientID }));
