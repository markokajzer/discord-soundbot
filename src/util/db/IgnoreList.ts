import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('db.json');
const connection = lowdb(adapter);

export const exists = (id: string) =>
  !!connection
    .get('ignoreList')
    .find({ id })
    .value();

export const add = (id: string) => {
  if (exists(id)) return;

  connection
    .get('ignoreList')
    .push({ id })
    .write();
};

export const remove = (id: string) => {
  connection
    .get('ignoreList')
    .remove({ id })
    .write();
};
