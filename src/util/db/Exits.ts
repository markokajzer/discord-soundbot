import db, { write } from "./connection";

export const get = (userId: string) => db.data.exits[userId];
export const exists = (userId: string) => !!get(userId);

export const add = (userId: string, sound: string) => {
  db.data.exits[userId] = sound;
  write();
};

export const remove = (userId: string) => {
  delete db.data.exits[userId];
  write();
};
