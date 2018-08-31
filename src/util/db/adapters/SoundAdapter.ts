import lowdb from 'lowdb';

import Sound from '../models/Sound';

export default class SoundAdapter {
  public readonly connection: lowdb.LowdbSync<any>;

  constructor(connection: lowdb.LowdbSync<any>) {
    this.connection = connection;
  }

  public findByName(name: string) {
    return this.all().find({ name });
  }

  public exists(name: string) {
    return !!this.findByName(name).value();
  }

  public add(sound: string) {
    this.all()
      .push(new Sound(sound))
      .write();
  }

  public rename(oldName: string, newName: string) {
    this.findByName(oldName)
      .assign({ name: newName })
      .write();
  }

  public remove(name: string) {
    this.all().remove({ name }).write();
  }

  public incrementCount(sound: string) {
    if (!this.exists(sound)) this.add(sound);

    const newValue = (this.findByName(sound).value()! as Sound).count + 1;
    this.findByName(sound).set('count', newValue).write();
  }

  public withTag(tag: string) {
    return this.all()
      .filter((sound: Sound) => sound.tags.includes(tag))
      .map((sound: Sound) => sound.name)
      .value();
  }

  public addTags(sound: string, tags: Array<string>) {
    if (!this.exists(sound)) this.add(sound);
    tags.forEach(tag => this.addSingleTag(sound, tag));
  }

  public listTags(sound: string) {
    if (!this.exists(sound)) return [];
    return (this.findByName(sound).value()! as Sound).tags.sort();
  }

  public clearTags(sound: string) {
    if (!this.exists(sound)) return;

    this.findByName(sound).assign({ tags: [] }).write();
  }

  public mostPlayed(limit = 15) {
    return this.all()
      .sortBy('count')
      .reverse()
      .take(limit)
      .value();
  }

  private all() {
    return this.connection.get('sounds');
  }

  private addSingleTag(sound: string, tag: string) {
    const tags = (this.findByName(sound).value()! as Sound).tags;
    if (tags.includes(tag)) return;

    tags.push(tag);
    this.findByName(sound).assign({ tags }).write();
  }
}
