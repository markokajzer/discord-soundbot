import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

import type Sound from "./models/Sound";

interface Schema {
  entrances: Record<string, string>;
  exits: Record<string, string>;
  ignoreList: string[];
  sounds: Sound[];
}

const adapter = new FileSync<Schema>("db.json");
const connection = lowdb(adapter);

connection
  .defaults({
    entrances: {},
    exits: {},
    ignoreList: [],
    sounds: [],
  })
  .write();

export default connection;
