import db, { write } from "./connection";
import Sound from "./models/Sound";

export const findByName = (name: string) => db.data.sounds.find((s) => s.name === name);

export const exists = (name: string) => !!findByName(name);

export const add = (sound: string) => {
  db.data.sounds.push(new Sound(sound));
  write();
};

export const rename = (oldName: string, newName: string) => {
  if (!exists(oldName)) throw new Error("Sound does not exist. Check existence first.");

  // biome-ignore lint/style/noNonNullAssertion: checking existence above
  findByName(oldName)!.name = newName;
  write();
};

export const remove = (name: string) => {
  const index = db.data.sounds.findIndex((s) => s.name === name);
  db.data.sounds.splice(index, 1);
  write();
};

export const incrementCount = (sound: string) => {
  if (!exists(sound)) add(sound);

  // biome-ignore lint/style/noNonNullAssertion: checking existence above
  findByName(sound)!.count += 1;
  write();
};

export const withTag = (tag: string) =>
  db.data.sounds.filter((sound) => sound.tags.includes(tag)).map((sound) => sound.name);

export const addTags = (sound: string, tags: string[]) => {
  if (!exists(sound)) add(sound);

  // biome-ignore lint/style/noNonNullAssertion: checking existence above
  const entry = findByName(sound)!;
  for (const tag of tags) {
    if (!entry.tags.includes(tag)) {
      entry.tags.push(tag);
    }
  }
  write();
};

export const listTags = (sound: string) => {
  if (!exists(sound)) return [];

  // biome-ignore lint/style/noNonNullAssertion: checking existence above
  return findByName(sound)!.tags.sort();
};

export const clearTags = (sound: string) => {
  if (!exists(sound)) return;

  // biome-ignore lint/style/noNonNullAssertion: checking existence above
  findByName(sound)!.tags = [];
  write();
};

export const mostPlayed = (limit = 15) =>
  db.data.sounds.sort((a, b) => b.count - a.count).slice(0, limit);
