export default interface ConfigInterface {
  clientID: string;
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
