export type ConfigValue = boolean | number | string | string[];

export default interface ConfigInterface {
  [key: string]: ConfigValue | undefined;

  clientId: string;
  token: string;
  language?: string;
  prefix?: string;
  acceptedExtensions?: string[];
  maximumFileSize?: number;
  volume?: number;
  deleteMessages?: boolean;
  stayInChannel?: boolean;
  timeout?: number;
  deafen?: boolean;
  game?: string;
}
