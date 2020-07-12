import ConfigInterface from './ConfigInterface';

const DEFAULT_CONFIG: ConfigInterface = {
  clientId: '',
  token: '',

  language: 'en',
  prefix: '!',
  acceptedExtensions: ['.mp3', '.wav'],
  maximumFileSize: 1000000, // 1 MB
  volume: 1.0,
  deleteMessages: false,
  stayInChannel: false,
  timeout: 10, // Minutes
  deafen: false,
  game: 'SoundBoard',
  elevatedRoles: ['admin']
};

export default DEFAULT_CONFIG;
