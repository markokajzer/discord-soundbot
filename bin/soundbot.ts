#!/usr/bin/env node

import container from '../src/util/Container';

import localize from '@util/i18n/localize';
import SoundBot from '../src/bot/SoundBot';
import Config from '../src/config/Config';

const config = container.cradle.config as Config;

localize.setLocale(config.language);

const bot = container.cradle.soundBot as SoundBot;
bot.start();

console.info(localize.t('url', { clientId: config.clientID }));
