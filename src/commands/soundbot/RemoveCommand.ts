import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import ICommand from '../base/ICommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';
import SoundUtil from '../../util/SoundUtil';

export default class RemoveCommand implements ICommand {
  public readonly TRIGGERS = ['remove'];
  public readonly USAGE = 'Usage: !remove <sound>';
  private readonly db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  public run(message: Message, params: Array<string>) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (params.length !== 1) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = params.shift()!;
    if (!SoundUtil.soundExists(sound)) {
      message.channel.send(`${sound} not found!`);
      return;
    }

    const file = SoundUtil.getPathForSound(sound);
    fs.unlinkSync(file);
    this.db.removeSound(sound);

    message.channel.send(`${sound} removed!`);
  }
}
