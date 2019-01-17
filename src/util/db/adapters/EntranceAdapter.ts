import lowdb from 'lowdb';

export default class EntranceAdapter {
  private readonly connection: lowdb.LowdbSync<any>;

  constructor(connection: lowdb.LowdbSync<any>) {
    this.connection = connection;
  }

  public exists(userId: string) {
    return !!this.get(userId);
  }

  public get(userId: string) {
    return this.connection.get(`entrances.${userId}`).value();
  }

  public add(userId: string, sound: string) {
    this.connection.set(`entrances.${userId}`, sound).write();
  }

  public remove(userId: string) {
    this.connection.unset(`entrances.${userId}`).write();
  }
}
