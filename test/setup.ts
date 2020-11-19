import fs from 'fs';

jest.mock('~/util/i18n/i18n');

if (fs.existsSync('./test-db.json')) fs.unlinkSync('./test-db.json');
