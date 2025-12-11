import { JSONFileSyncPreset } from "lowdb/node";

const defaultData = {
  entrances: {} as Record<string, string>,
  exits: {} as Record<string, string>,
  ignoreList: [] as string[],
  sounds: [] as Array<{ name: string; count: number; tags: string[] }>,
};

const db = JSONFileSyncPreset("test-db.json", defaultData);

export default db;
