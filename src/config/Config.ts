import { storagePath } from '@util/FileLocations';
import fs from 'fs';
import lodash from 'lodash';

import ConfigInterface from './ConfigInterface';
import DEFAULT_CONFIG from './DefaultConfig';

export default class Config implements ConfigInterface {
  public clientId!: string;
  public token!: string;
  public language!: string;
  public prefix!: string;
  public acceptedExtensions!: string[];
  public maximumFileSize!: number;
  public volume!: number;
  public deleteMessages!: boolean;
  public stayInChannel!: boolean;
  public deafen!: boolean;
  public game!: string;

  private readonly CONFIG_PATH = storagePath('config.json');
  private readonly MODIFIABLE_FIELDS = [
    'language',
    'prefix',
    'acceptedExtensions',
    'maximumFileSize',
    'volume',
    'deleteMessages',
    'stayInChannel',
    'deafen',
    'game'
  ];

  private readonly JSON_KEYS = ['clientId', 'token', ...this.MODIFIABLE_FIELDS];

  [index: string]: any;

  constructor() {
    this.initialize();
  }

  public has(field: string) {
    return this.MODIFIABLE_FIELDS.includes(field);
  }

  public set(field: string, value: string[]) {
    switch (typeof this[field]) {
      case 'string':
        // eslint-disable-next-line prefer-destructuring
        this[field] = value[0];
        break;
      case 'number':
        this[field] = parseFloat(value[0]);
        break;
      case 'boolean':
        this[field] = value[0].toLowerCase() === 'true';
        break;
      case 'object':
        this[field] = value;
        break;
      default:
        break;
    }

    this.writeToConfig();
  }

  public setFrom(data: ConfigInterface) {
    Object.keys(data).forEach(field => {
      this[field] = data[field];
    });
  }

  private initialize() {
    this.initializeDefaultConfig();
    if (fs.existsSync(this.CONFIG_PATH)) {
      this.initializeWithSavedConfig();
    }

    this.initializeFromEnvironmentVariables();
  }

  private initializeDefaultConfig() {
    this.setFrom(DEFAULT_CONFIG);
  }

  private initializeWithSavedConfig() {
    // eslint-disable-next-line
    const savedConfig = require(this.CONFIG_PATH);
    this.setFrom(savedConfig);
  }

  private initializeFromEnvironmentVariables() {
    for (let envKey in process.env) {
      const configKey = lodash.camelCase(envKey);
      if (!this.JSON_KEYS.includes(configKey)) {
        continue;
      }

      this.set(configKey, [process.env[envKey]!]);
    }
  }

  private writeToConfig() {
    fs.writeFile(this.CONFIG_PATH, JSON.stringify(this, this.JSON_KEYS, 2), error => {
      if (error) console.error(error);
    });
  }
}
