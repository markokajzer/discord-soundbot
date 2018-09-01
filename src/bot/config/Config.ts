import config from '../../../../config/config.json';

export default class Config {
  [index: string]: any;

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

  constructor() {
    this.initializeWith(config);
  }

  public has(field: string) {
    return this.hasOwnProperty(field);
  }

  public set(field: string, value: Array<string>) {
    if (!this.has(field)) return;

    switch (typeof this[field]) {
      case 'string':
        this[field] = value[0];
      case 'number':
        this[field] = parseInt(value[0]);
      case 'boolean':
        this[field] = value[0] === 'true';
      case 'object':
        this[field] = value;
    }
  }

  private initializeWith(data: any) {
    Object.keys(data).forEach(field => this[field] = data[field]);
  }
}
