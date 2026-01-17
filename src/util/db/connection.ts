import { JSONFileSyncPreset } from "lowdb/node";

import type Sound from "./models/Sound";
import { queuedWrite } from "./WriteQueue";

interface Schema {
  entrances: Record<string, string>;
  exits: Record<string, string>;
  ignoreList: string[];
  sounds: Sound[];
}

const defaultData: Schema = {
  entrances: {},
  exits: {},
  ignoreList: [],
  sounds: [],
};

const db = JSONFileSyncPreset<Schema>("db.json", defaultData);

export const write = () => queuedWrite(() => db.write());

export default db;
