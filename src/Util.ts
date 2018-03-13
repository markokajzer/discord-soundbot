import Discord from 'discord.js';

import Adapter from './db/Adapter';

class Util {
  public readonly db: Adapter;

  constructor() {
    this.db = new Adapter();
  }

  public isIgnoredUser(user: Discord.User) {
    return this.db.isIgnoredUser(user.id);
  }

  public updateCount(playedSound: string) {
    this.db.updateSoundCount(playedSound);
  }
}

export default new Util();
