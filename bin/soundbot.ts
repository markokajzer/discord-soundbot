#!/usr/bin/env node

import container from '../src/util/Container';

import SoundBot from '../src/bot/SoundBot';
import Config from '../src/config/Config';
import LocaleService from '../src/util/i18n/LocaleService';

const config = container.cradle.config as Config;
const localeService = container.cradle.localeService as LocaleService;
localeService.setLocale(config.language);

const bot = container.cradle.soundBot as SoundBot;
bot.start();

console.info(localeService.t('url', { clientId: config.clientID }));
