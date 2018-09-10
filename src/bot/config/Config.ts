import fs from 'fs';
import path from 'path';

import exampleConfig from '../../../config/config.example.json';

export default class Config {
  public clientID!: string;
  public token!: string;
  public language!: string;
  public prefix!: string;
  public acceptedExtensions!: Array<string>;
  public maximumFileSize!: number;
  public volume!: number;
  public deleteMessages!: boolean;
  public stayInChannel!: boolean;
  public deafen!: boolean;
  public game!: string;

  private readonly BLACKLIST = ['clientID', 'token'];
  private readonly JSON_KEYS!: Array<string>;
  private readonly CONFIG_PATH = path.join(__dirname, '..', '..', '..', '..', 'config', 'config.json');

  [index: string]: any;

  constructor() {
    this.initialize();
    this.JSON_KEYS = Object.keys(this).filter(key =>
      !['BLACKLIST', 'JSON_KEYS', 'CONFIG_PATH'].includes(key));
  }

  public has(field: string) {
    return this.JSON_KEYS.includes(field);
  }

  public set(field: string, value: Array<string>) {
    if (!this.has(field)) return;
    if (this.BLACKLIST.includes(field)) return;

    switch (typeof this[field]) {
      case 'string':
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
    }

    this.writeToConfig();
  }

  public setFromObject(data: any) {
    Object.keys(data).forEach(field => {
      if (this.has(field)) this[field] = data[field];
    });
  }

  private initialize() {
    if (!require.resolve(this.CONFIG_PATH)) {
      this.initializeWithExampleConfig();
      return;
    }

    this.initializeWithSavedConfig();
  }

  private initializeWith(data: any) {
    Object.keys(data).forEach(field => this[field] = data[field]);
  }

  private initializeWithExampleConfig() {
    this.initializeWith(exampleConfig);
  }

  private initializeWithSavedConfig() {
    const savedConfig = require(this.CONFIG_PATH);
    this.initializeWith(savedConfig);
  }

  private writeToConfig() {
    fs.writeFile(this.CONFIG_PATH, JSON.stringify(this, this.JSON_KEYS, '  '), error => {
      if (error) console.error(error);
    });
  }
}
