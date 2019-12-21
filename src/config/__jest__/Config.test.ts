import fs from 'fs';
import Config from '../Config';
import lodash from 'lodash';

jest.mock('fs');
describe('Default variables', () => {
  let testedConfig = new Config();
  test('Default clientID and token are empty', () => {
    expect(testedConfig.clientId).toEqual('');
    expect(testedConfig.token).toEqual('');
  });
  test('Default language is English', () => {
    expect(testedConfig.language).toEqual('en');
  });
  test('Default command prefix is !', () => {
    expect(testedConfig.prefix).toEqual('!');
  });
  test('Default whitelisted extensions are mp3 and wav files', () => {
    expect(testedConfig.acceptedExtensions).toEqual(['.mp3', '.wav']);
  });
  test('Default maximum filesize is ', () => {
    expect(testedConfig.maximumFileSize).toEqual(1000000);
  });
  test('Default setting to delete messages is false', () => {
    expect(testedConfig.deleteMessages).toBeFalsy();
  });
  test('Default setting to stay in the channel is false', () => {
    expect(testedConfig.stayInChannel).toBeFalsy();
  });
  test('Default setting to deafen the bot is false', () => {
    expect(testedConfig.deafen).toBeFalsy();
  });
  test('Default game is not set', () => {
    expect(testedConfig.game).toEqual('');
  });
});

describe('Setting config from Environment Variables', () => {
  const OLD_ENVIRONMENT_VARIABLES = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENVIRONMENT_VARIABLES };
  });

  afterEach(() => {
    process.env = OLD_ENVIRONMENT_VARIABLES;
  });

  let randomString = (length: number) => {
    return lodash.times(length, () => lodash.random(35).toString(36)).join('');
  };

  test('You can overwrite any string value from the environment', () => {
    process.env.CLIENT_ID = randomString(20);
    process.env.TOKEN = randomString(20);
    process.env.LANGUAGE = randomString(2);
    process.env.PREFIX = randomString(1);
    process.env.GAME = randomString(20);
    let testedConfig = new Config();
    expect(testedConfig.clientId).toEqual(process.env.CLIENT_ID);
    expect(testedConfig.token).toEqual(process.env.TOKEN);
    expect(testedConfig.language).toEqual(process.env.LANGUAGE);
    expect(testedConfig.prefix).toEqual(process.env.PREFIX);
    expect(testedConfig.game).toEqual(process.env.GAME);
  });

  test('You can set boolean config values to `true` from the environment', () => {
    process.env.DELETE_MESSAGES = 'tRuE';
    process.env.STAY_IN_CHANNEL = 'TruE';
    process.env.DEAFEN = 'TRUE';

    let testedConfig = new Config();

    expect(testedConfig.deleteMessages).toStrictEqual(true);
    expect(testedConfig.stayInChannel).toStrictEqual(true);
    expect(testedConfig.deafen).toStrictEqual(true);
  });

  test('You can set boolean config values to `false` from the environment', () => {
    process.env.DELETE_MESSAGES = 'false';
    process.env.STAY_IN_CHANNEL = 'neen';
    process.env.DEAFEN = 'anything else than true';

    let testedConfig = new Config();

    expect(testedConfig.deleteMessages).toStrictEqual(false);
    expect(testedConfig.stayInChannel).toStrictEqual(false);
    expect(testedConfig.deafen).toStrictEqual(false);
  });
});
