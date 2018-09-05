import fs from 'fs';

import config from '../../../config/config.json';

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

  [index: string]: any;

  constructor() {
    this.initializeWith(config);
    this.JSON_KEYS = Object.keys(this).filter(key => !['BLACKLIST', 'JSON_KEYS'].includes(key));
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
        this[field] = parseInt(value[0]);
        break;
      case 'boolean':
        this[field] = value[0] === 'true';
        break;
      case 'object':
        this[field] = value;
    }

    this.writeToConfig();
  }

  private initializeWith(data: any) {
    Object.keys(data).forEach(field => this[field] = data[field]);
  }

  private writeToConfig() {
    fs.writeFile('./config/config.json', JSON.stringify(this, this.JSON_KEYS, '  '), error => {
      if (error) console.error(error);
    });
  }
}
