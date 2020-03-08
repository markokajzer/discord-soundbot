import ConfigInterface from './ConfigInterface';

const DEFAULT_CONFIG: Omit<ConfigInterface, 'clientId' | 'token'> = {
  language: 'en',
  prefix: '!',
  acceptedExtensions: ['.mp3', '.wav'],
  maximumFileSize: 1000000, // 1 MB
  volume: 1.0,
  deleteMessages: false,
  stayInChannel: false,
  deafen: false,
  game: 'SoundBoard'
};

export default DEFAULT_CONFIG;
