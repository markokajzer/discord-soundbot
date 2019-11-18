export default interface ConfigInterface {
  [key: string]: boolean | number | string | string[] | undefined;

  clientId: string;
  token: string;
  language?: string;
  prefix?: string;
  acceptedExtensions?: string[];
  maximumFileSize?: number;
  volume?: number;
  deleteMessages?: boolean;
  stayInChannel?: boolean;
  deafen?: boolean;
  game?: string;
}
