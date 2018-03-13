import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

export default class DatabaseAdapter {
  private db: any;

  constructor() {
    const adapter = new FileSync('db.json');
    this.db = low(adapter);
    this.ensureDefaults();
  }

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

  public getMostPlayedSounds(limit = 15): Array<{ name: string, count: number }> {
    return this.db.get('counts').sortBy('count').reverse().take(limit).value();
  }

  public updateSoundCount(playedSound: string) {
    if (!this.soundExists(playedSound)) this.addNewSound(playedSound);
    this.updateCount(playedSound);
  }

  private ensureDefaults() {
    this.db.defaults({ counts: [], ignoreList: [] }).write();
  }

  private soundExists(sound: string) {
    return this.db.get('counts').find({ name: sound }).value() !== undefined;
  }

  private addNewSound(sound: string) {
    this.db.get('counts').push({ name: sound, count: 0 }).write();
  }

  private updateCount(sound: string) {
    const newValue = this.db.get('counts').find({ name: sound }).value().count + 1;
    this.db.get('counts').find({ name: sound }).assign({ count: newValue }).write();
  }
}
