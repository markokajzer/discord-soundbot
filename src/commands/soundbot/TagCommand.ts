import { Message, Permissions } from 'discord.js';

import ICommand from '../base/ICommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';
import SoundUtil from '../../util/SoundUtil';

export default class TagCommand implements ICommand {
  public readonly TRIGGERS = ['tag', 'tags'];
  public readonly USAGE = 'Usage: !tag <sound> [<tag> ... <tagN> | clear]';
  private readonly db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  public run(message: Message, params: Array<string>) {
    if (params.length < 1) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = params.shift()!;
    if (!SoundUtil.getSounds().includes(sound)) {
      message.channel.send(`${sound} not found!`);
      return;
    }

    if (!params.length) {
      message.channel.send(`Tags for ${sound}: [${this.db.listTags(sound)}]`);
      return;
    }

    if (params[0] === 'clear') {
      if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;
      this.db.removeTags(sound);
      return;
    }

    this.db.addTags(sound, params);
  }
}
