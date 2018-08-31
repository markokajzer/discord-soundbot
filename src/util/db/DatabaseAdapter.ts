/* tslint:disable member-ordering */

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

export default class DatabaseAdapter {
  private db: any;

  constructor() {
    const adapter = new FileSync('db.json');
    this.db = low(adapter);
    this.ensureDefaults();
  }

  /////////////////
  // Sounds
  /////////////////
  public removeSound(sound: string) {
    this.db.get('sounds').remove({ name: sound }).write();
  }

  public renameSound(oldName: string, newName: string) {
    this.db.get('sounds').find({ name: oldName }).assign({ name: newName }).write();
  }

  public soundsWithTag(tag: string): Array<string>  {
    return this.db.get('sounds').value().filter((sound: any) => sound.tags.includes(tag))
                                        .map((sound: any) => sound.name);
  }

  private soundExists(sound: string) {
    return this.db.get('sounds').find({ name: sound }).value() !== undefined;
  }

  /////////////////
  // Count
  /////////////////
  public getMostPlayedSounds(limit = 15): Array<{ name: string, count: number }> {
    return this.db.get('sounds').sortBy('count').reverse().take(limit).value();
  }

  public updateSoundCount(playedSound: string) {
    if (!this.soundExists(playedSound)) this.addNewSound(playedSound);
    this.updateCount(playedSound);
  }

  private addNewSound(sound: string) {
    this.db.get('sounds').push({ name: sound, count: 0, tags: [] }).write();
  }

  private updateCount(sound: string) {
    const newValue = this.db.get('sounds').find({ name: sound }).value().count + 1;
    this.db.get('sounds').find({ name: sound }).assign({ count: newValue }).write();
  }

  /////////////////
  // Tags
  /////////////////
  public addTags(sound: string, tags: Array<string>) {
    if (!this.soundExists(sound)) this.addNewSound(sound);
    tags.forEach(tag => this.addTag(sound, tag));
  }

  public listTags(sound: string) {
    return this.db.get('sounds').find({ name: sound }).value().tags.sort();
  }

  public removeTags(sound: string) {
    this.db.get('sounds').find({ name: sound }).assign({ tags: [] }).write();
  }

  private addTag(sound: string, tag: string) {
    const tags = this.db.get('sounds').find({ name: sound }).value().tags;
    if (tags.includes(tag)) return;
    tags.push(tag);

    this.db.get('sounds').find({ name: sound }).assign({ tags: tags }).write();
  }

  /////////////////
  // Ignore List
  /////////////////
  public addIgnoredUser(userID: string) {
    if (!this.isIgnoredUser(userID)) {
      this.db.get('ignoreList').push({ id: userID }).write();
    }
  }

  public isIgnoredUser(userID: string) {
    const user = this.db.get('ignoreList').find({ id: userID }).value();
    return !!user;
  }

  public removeIgnoredUser(userID: string) {
    this.db.get('ignoreList').remove({ id: userID }).write();
  }

  /////////////////
  // Helpers
  /////////////////
  private ensureDefaults() {
    this.db.defaults({ sounds: [], ignoreList: [] }).write();
  }
}
