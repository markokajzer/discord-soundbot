import fs from 'fs';
// NOTE: This is only used in this lib task and is therefore not extraneous
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const LANGUAGES = ['de', 'en', 'es', 'fr', 'hu', 'it', 'ja', 'nl'];

const API_TOKEN = '5b0997bf65dda0118525394d45c84d14';
const PROJECT_ID = '392681';

// For request options see https://poeditor.com/docs/api#projects
const requestOptions = {
  api_token: API_TOKEN,
  filters: 'translated',
  id: PROJECT_ID,
  order: 'terms',
  type: 'key_value_json'
};

const fetchFileUrl = async (params: URLSearchParams): Promise<string> => {
  const response = await fetch('https://api.poeditor.com/v2/projects/export', {
    body: params,
    method: 'post'
  });

  const result = await response.json();
  return result.result.url;
};

const downloadFile = (url: string, language: string) =>
  new Promise(resolve => {
    fetch(url).then(res => {
      const dest = fs.createWriteStream(`./config/locales/${language}.json`);
      res.body.pipe(dest).on('close', resolve);
    });
  });

console.info('Updating translations...');

LANGUAGES.forEach(async language => {
  const body = { ...requestOptions, language };
  const params = new URLSearchParams(body);

  const url = await fetchFileUrl(params);
  await downloadFile(url, language);
});
