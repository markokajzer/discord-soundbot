import config from '../config/config.json';

import container from './di/DependencyGraph';

const localeService = container.cradle.localeService;
localeService.setLocale(config.language);

const bot = container.cradle.soundBot;
bot.start();
console.log(localeService.t('url', { clientId: config.clientID }));  // tslint:disable-line no-console
