import lowdb from 'lowdb';

export default class IgnoreListAdapter {
  private readonly connection: lowdb.LowdbSync<any>;

  constructor(connection: lowdb.LowdbSync<any>) {
    this.connection = connection;
  }

  public exists(id: string) {
    return !!this.connection.get('ignoreList').find({ id }).value();
  }

  public add(id: string) {
    if (!this.exists(id)) {
      this.connection.get('ignoreList').push({ id }).write();
    }
  }

  public remove(id: string) {
    this.connection.get('ignoreList').remove({ id }).write();
  }
}
