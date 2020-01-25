#!/usr/bin/env node

import localize from '@util/i18n/localize';
import container from '../src/util/Container';

const { config } = container;

localize.setLocale(config.language);

const bot = container.soundBot;
bot.start();

console.info(localize.t('url', { clientId: config.clientId }));
