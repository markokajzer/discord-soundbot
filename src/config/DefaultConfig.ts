import ConfigInterface from './ConfigInterface';

const DEFAULT_CONFIG: ConfigInterface = {
  acceptedExtensions: ['.mp3', '.wav'],
  clientId: '',

  // Minutes
deafen: false,
  
deleteMessages: false,
  
elevatedRoles: [],
  
game: 'SoundBoard', 
  
language: 'en',
  

maximumFileSize: 1000000,
  

prefix: '!',
  

stayInChannel: false, 
  
timeout: 10,
  
token: '',
  // 1 MB
volume: 1.0
};

export default DEFAULT_CONFIG;
