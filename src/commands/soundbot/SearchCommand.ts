import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';
import LocaleService from '../../i18n/LocaleService';
import SoundUtil from '../../util/SoundUtil';

export default class SearchCommand implements ICommand {
  public readonly TRIGGERS = ['search'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !search <tag>';
  private readonly localeService: LocaleService;
  private readonly db: DatabaseAdapter;

  constructor(localeService: LocaleService, db: DatabaseAdapter) {
    this.localeService = localeService;
    this.db = db;
  }

  public run(message: Message, params: Array<string>) {
    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const tag = params.shift()!;
    const results = SoundUtil.getSounds().filter(sound => sound.includes(tag));
    this.db.soundsWithTag(tag).forEach(sound => results.push(sound));

    if (!results.length) {
      message.author.send(this.localeService.t('search.notFound'));
      return;
    }

    const uniqueResults = [...new Set(results)].sort();
    message.author.send(uniqueResults.join('\n'));
  }
}
