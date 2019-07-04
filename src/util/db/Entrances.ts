import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('db.json');
const connection = lowdb(adapter);

export const exists = (userId: string) => !!get(userId);

export const get = (userId: string) =>
  connection.get(`entrances.${userId}`).value();

export const add = (userId: string, sound: string) => {
  connection.set(`entrances.${userId}`, sound).write();
};

export const remove = (userId: string) => {
  connection.unset(`entrances.${userId}`).write();
};
