import db, { write } from "./connection";

export const exists = (id: string) => db.data.ignoreList.includes(id);

export const add = (id: string) => {
  if (exists(id)) return;

  db.data.ignoreList.push(id);
  write();
};

export const remove = (id: string) => {
  const index = db.data.ignoreList.indexOf(id);
  if (index !== -1) {
    db.data.ignoreList.splice(index, 1);
    write();
  }
};
