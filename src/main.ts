import config from '../config/config.json';

import container from './di/DependencyGraph';

import SoundBot from './bot/SoundBot';
import LocaleService from './i18n/LocaleService';

const localeService = container.cradle.localeService as LocaleService;
localeService.setLocale(config.language);

const bot = container.cradle.soundBot as SoundBot;
bot.start();
console.log(localeService.t('url', { clientId: config.clientID }));  // tslint:disable-line no-console
