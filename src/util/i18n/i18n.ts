import i18n from 'i18n';

import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('./config/locales');

i18n.configure({
  locales: files.map(file => path.basename(file, '.json')),
  defaultLocale: 'en',
  directory: path.join(process.cwd(), 'config', 'locales'),
  objectNotation: true
});

(i18n as any).translate = i18n.__mf;

export default i18n;
