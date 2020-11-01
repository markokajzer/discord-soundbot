#!/usr/bin/env node

import Container from '~/util/Container';
import localize from '~/util/i18n/localize';

const { config, soundBot: bot } = Container;

localize.setLocale(config.language);
bot.start();

console.info(localize.t('url', { clientId: config.clientId }));
