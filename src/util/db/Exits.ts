import connection from './connection';

const table = 'exits';

export const get = (userId: string) => connection.get(`${table}.${userId}`).value();
export const exists = (userId: string) => !!get(userId);
export const add = (userId: string, sound: string) => {
  connection.set(`${table}.${userId}`, sound).write();
};

export const remove = (userId: string) => {
  connection.unset(`${table}.${userId}`).write();
};
