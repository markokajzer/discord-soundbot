import fs from 'fs';
import path from 'path';

import i18n from 'i18n';

import { I18nProvider } from './I18nProvider';

const localesPath = path.join(__dirname, '..', '..', '..', '..', 'config', 'locales');
const files = fs.readdirSync(localesPath);

i18n.configure({
  locales: files.map(file => path.basename(file, '.json')),
  defaultLocale: 'en',
  directory: localesPath,
  objectNotation: true,
  updateFiles: false
});

const localize: I18nProvider = {
  getLocale: i18n.getLocale,
  getLocales: i18n.getLocales,
  setLocale: i18n.setLocale,
  translate: i18n.__mf, // eslint-disable-line no-underscore-dangle
  t: i18n.__mf // eslint-disable-line no-underscore-dangle
};

export default localize;
