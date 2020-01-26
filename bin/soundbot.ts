#!/usr/bin/env node

import localize from '@util/i18n/localize';
import Container from '@util/Container';

const { config, soundBot: bot } = Container;

localize.setLocale(config.language);
bot.start();

console.info(localize.t('url', { clientId: config.clientId }));
