import { Message } from 'discord.js';

import Command from './base/Command';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import SoundUtil from '@util/SoundUtil';

export default class EntranceCommand implements Command {
  public readonly TRIGGERS = ['entrance'];
  public readonly USAGE = 'Usage: !entrance <sound>';
  public readonly db: DatabaseAdapter;
  public readonly soundUtil: SoundUtil;

  constructor(db: DatabaseAdapter, soundUtil: SoundUtil) {
    this.db = db;
    this.soundUtil = soundUtil;
  }

  public run(message: Message, params: string[]) {
    const [entranceSound] = params;
    if (!entranceSound) {
      this.db.entrances.remove(message.author.id);
      return;
    }

    const sounds = this.soundUtil.getSounds();
    if (!sounds.includes(entranceSound)) return;

    this.db.entrances.add(message.author.id, entranceSound);
  }
}
