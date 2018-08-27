import i18n = require('i18n');

import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('./config/locales');


i18n.configure({
  locales: files.map(file => file.split('.')[0]),
  defaultLocale: 'en',
  directory: path.join(__dirname, '..', '..', 'config', 'locales'),
  objectNotation: true
});

(i18n as any).translate = i18n.__mf;

export default i18n;
