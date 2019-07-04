import { Message } from 'discord.js';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class EntranceCommand implements Command {
  public readonly TRIGGERS = ['entrance'];
  public readonly USAGE = 'Usage: !entrance <sound>';
  public readonly db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  public run(message: Message, params: string[]) {
    const [entranceSound] = params;
    if (!entranceSound) {
      this.db.entrances.remove(message.author.id);
      return;
    }

    const sounds = getSounds();
    if (!sounds.includes(entranceSound)) return;

    this.db.entrances.add(message.author.id, entranceSound);
  }
}
