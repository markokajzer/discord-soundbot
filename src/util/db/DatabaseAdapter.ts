import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import EntranceAdapter from './adapters/EntranceAdapter';
import IgnoreListAdapter from './adapters/IgnoreListAdapter';
import SoundAdapter from './adapters/SoundAdapter';

export default class DatabaseAdapter {
  public readonly connection: lowdb.LowdbSync<any>;
  public readonly sounds: SoundAdapter;
  public readonly ignoreList: IgnoreListAdapter;
  public readonly entrances: EntranceAdapter;

  constructor() {
    const adapter = new FileSync('db.json');
    this.connection = lowdb(adapter);
    this.ensureDefaults();

    this.sounds = new SoundAdapter(this.connection);
    this.ignoreList = new IgnoreListAdapter(this.connection);
    this.entrances = new EntranceAdapter(this.connection);
  }

  private ensureDefaults() {
    this.connection.defaults({ sounds: [], ignoreList: [], entrances: {} }).write();
  }
}
