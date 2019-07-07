import fs from 'fs';
import path from 'path';

import ConfigInterface from './ConfigInterface';
import EXAMPLE_CONFIG from './ExampleConfig';

export default class Config implements ConfigInterface {
  public clientID!: string;
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

  private readonly CONFIG_PATH = path.join(process.cwd(), 'config', 'config.json');
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

  private readonly JSON_KEYS = ['clientID', 'token', ...this.MODIFIABLE_FIELDS];

  [index: string]: any;

  constructor() {
    this.initialize();
  }

  public has(field: string) {
    return this.MODIFIABLE_FIELDS.includes(field);
  }

  public set(field: string, value: string[]) {
    if (!this.has(field)) return;

    switch (typeof this[field]) {
      case 'string':
        // eslint-disable-next-line prefer-destructuring
        this[field] = value[0];
        break;
      case 'number':
        this[field] = parseFloat(value[0]);
        break;
      case 'boolean':
        this[field] = value[0] === 'true';
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
    Object.keys(data).forEach(field => { this[field] = data[field]; });
  }

  private initialize() {
    if (!fs.existsSync(this.CONFIG_PATH)) {
      this.initializeWithExampleConfig();
      return;
    }

    this.initializeWithSavedConfig();
  }

  private initializeWithExampleConfig() {
    this.ensureConfigDirectoryExists();
    this.setFrom(EXAMPLE_CONFIG);
  }

  private initializeWithSavedConfig() {
    // eslint-disable-next-line
    const savedConfig = require(this.CONFIG_PATH);
    this.setFrom(savedConfig);
  }

  private ensureConfigDirectoryExists() {
    if (!fs.existsSync(path.dirname(this.CONFIG_PATH))) {
      fs.mkdirSync(path.dirname(this.CONFIG_PATH));
    }
  }

  private writeToConfig() {
    fs.writeFile(this.CONFIG_PATH, JSON.stringify(this, this.JSON_KEYS, 2), error => {
      if (error) console.error(error);
    });
  }
}
