import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const table = 'exits';

const adapter = new FileSync('db.json');
const connection = lowdb(adapter);

export const get = (userId: string) => connection.get(`${table}.${userId}`).value();
export const exists = (userId: string) => !!get(userId);
export const add = (userId: string, sound: string) => {
  connection.set(`${table}.${userId}`, sound).write();
};

export const remove = (userId: string) => {
  connection.unset(`${table}.${userId}`).write();
};
