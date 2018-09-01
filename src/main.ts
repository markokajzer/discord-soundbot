import config from '@config/config.json';

import container from './di/DependencyGraph';

import LocaleService from '@util/i18n/LocaleService';
import SoundBot from './bot/SoundBot';

const localeService = container.cradle.localeService as LocaleService;
localeService.setLocale(config.language);

const bot = container.cradle.soundBot as SoundBot;
bot.start();

console.info(localeService.t('url', { clientId: config.clientID }));
