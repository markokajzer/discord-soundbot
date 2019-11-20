import { TRANSLATIONS_DIR, translationsPath } from '@util/FileLocations';
import fs from 'fs';
import path from 'path';

const enumerateKeys = (obj: Record<string, string | Record<string, string>>): string[] => {
  const keys: string[] = [];

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      const subkeys = enumerateKeys(obj[key] as Record<string, string>);
      keys.push(...subkeys.map(subkey => `${key}.${subkey}`));
      return;
    }

    keys.push(key);
  });

  return keys;
};

const files = fs.readdirSync(TRANSLATIONS_DIR);
const locales = files.map(file => path.basename(file, '.json'));
const localesToCheck = locales.filter(locale => locale !== 'en');

// eslint-disable-next-line
const englishLocale = require(translationsPath('en.json'));
const englishKeys = enumerateKeys(englishLocale);

localesToCheck.forEach(locale => {
  // eslint-disable-next-line
  const localeObject = require(translationsPath(`${locale}.json`));
  const localeKeys = enumerateKeys(localeObject);
  const missingKeys = englishKeys.filter(key => !localeKeys.includes(key));

  if (missingKeys.length > 0) {
    console.error(`${locale.toUpperCase()} is missing the following keys:`);
    console.error(missingKeys);
    console.error();
  }
});
