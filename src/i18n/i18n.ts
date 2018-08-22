import i18n = require('i18n');
import path from 'path';

i18n.configure({
  locales: ['en', 'de', 'hu'],
  directory: path.join(__dirname, '..', '..', 'config', 'locales'),
  objectNotation: true
});

(i18n as any).translate = i18n.__mf;

export default i18n;
