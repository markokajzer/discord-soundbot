import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('test-db.json');
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
