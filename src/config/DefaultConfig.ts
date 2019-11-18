import ConfigInterface from './ConfigInterface';

const DEFAULT_CONFIG: ConfigInterface = {
  clientId: '',
  token: '',

  language: 'en',
  prefix: '!',
  acceptedExtensions: ['.mp3', '.wav'],
  maximumFileSize: 1000000,
  volume: 1.0,
  deleteMessages: false,
  stayInChannel: false,
  deafen: false,
  game: ''
};

export default DEFAULT_CONFIG;
