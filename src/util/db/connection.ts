import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import connectionSettings from './connectionSettings';

const adapter = new FileSync(connectionSettings.fileLocation);
const connection = lowdb(adapter);

connection
  .defaults({
    sounds: [],
    ignoreList: [],
    entrances: {},
    exits: {}
  })
  .write();

export default connection;
