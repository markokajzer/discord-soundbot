import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import IgnoreListAdapter from './adapters/IgnoreListAdapter';
import SoundAdapter from './adapters/SoundAdapter';

export default class DatabaseAdapter {
  public readonly connection: lowdb.LowdbSync<any>;
  public readonly sounds: SoundAdapter;
  public readonly ignoreList: IgnoreListAdapter;

  constructor() {
    const adapter = new FileSync('db.json');
    this.connection = lowdb(adapter);
    this.ensureDefaults();

    this.sounds = new SoundAdapter(this.connection);
    this.ignoreList = new IgnoreListAdapter(this.connection);
  }

  private ensureDefaults() {
    this.connection.defaults({ sounds: [], ignoreList: [] }).write();
  }
}
