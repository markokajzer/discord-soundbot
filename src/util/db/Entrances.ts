import db, { write } from "./connection";

export const get = (userId: string) => db.data.entrances[userId];
export const exists = (userId: string) => !!get(userId);

export const add = (userId: string, sound: string) => {
  db.data.entrances[userId] = sound;
  write();
};

export const remove = (userId: string) => {
  delete db.data.entrances[userId];
  write();
};
