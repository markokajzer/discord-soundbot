import fs from 'fs';
import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

// Support legacy lowdb location
let dbPath = 'db/test-db.json';
if (!fs.existsSync(dbPath) && fs.existsSync('test-db.json')) {
  dbPath = 'test-db.json';
} else if (!fs.existsSync('db')) {
  fs.mkdirSync('db');
}
const adapter = new FileSync(dbPath);
const connection = lowdb(adapter);

connection
  .defaults({
    entrances: {},
    exits: {},
    ignoreList: [],
    sounds: []
  })
  .write();

export default connection;
