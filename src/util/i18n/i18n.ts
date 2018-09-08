import i18n from 'i18n';

import fs from 'fs';
import path from 'path';

const localesPath = path.join(__dirname, '..', '..', '..', '..', 'config', 'locales');
const files = fs.readdirSync(localesPath);

i18n.configure({
  locales: files.map(file => path.basename(file, '.json')),
  defaultLocale: 'en',
  directory: localesPath,
  objectNotation: true
});

(i18n as any).translate = i18n.__mf;

export default i18n;
