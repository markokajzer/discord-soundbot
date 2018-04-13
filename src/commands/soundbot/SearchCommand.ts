import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';
import SoundUtil from '../../util/SoundUtil';

export default class SearchCommand implements ICommand {
  public readonly TRIGGERS = ['search'];
  public readonly USAGE = 'Usage: !search <tag>';
  private readonly db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  public run(message: Message, params: Array<string>) {
    if (params.length !== 1) {
      message.channel.send(this.USAGE);
      return;
    }

    const tag = params.shift()!;
    const results = SoundUtil.getSounds().filter(sound => sound.includes(tag));
    this.db.soundsWithTag(tag).forEach(sound => results.push(sound));

    if (!results.length) {
      message.author.send('No sounds found.');
      return;
    }

    const uniqueResults = [...new Set(results)].sort();
    message.author.send(uniqueResults.join('\n'));
  }
}
