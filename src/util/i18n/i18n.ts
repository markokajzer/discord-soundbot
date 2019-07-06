import i18n from 'i18n';

import fs from 'fs';
import path from 'path';

interface I18nProvider {
  getLocale: () => string;
  getLocales: () => string[];
  setLocale: (locale: string) => void;
  translate: (id: string, replacements?: Replacements) => string;
  t: (id: string, replacements?: Replacements) => string;
}

export interface Replacements {
  [key: string]: string | number | string[];
}

const localesPath = path.join(__dirname, '..', '..', '..', '..', 'config', 'locales');
const files = fs.readdirSync(localesPath);

i18n.configure({
  locales: files.map(file => path.basename(file, '.json')),
  defaultLocale: 'en',
  directory: localesPath,
  objectNotation: true,
  updateFiles: false
});

export default {
  getLocale: i18n.getLocale,
  getLocales: i18n.getLocales,
  setLocale: i18n.setLocale,
  translate: i18n.__mf,
  t: i18n.__mf
} as I18nProvider;
