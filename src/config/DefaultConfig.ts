import ConfigInterface from './ConfigInterface';

const DEFAULT_CONFIG: ConfigInterface = {
  clientId: '',
  token: '',

  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  acceptedExtensions: ['.mp3', '.wav'],
  deafen: false,
  deleteMessages: false,
  elevatedRoles: [],
  game: 'SoundBoard',
  language: 'en',
  maximumFileSize: 1000000, // 1 MB
  prefix: '!',
  stayInChannel: false,
  timeout: 10, // Minutes
  volume: 1.0
};

export default DEFAULT_CONFIG;
