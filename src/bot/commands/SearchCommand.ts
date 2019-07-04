import { Message } from 'discord.js';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import LocaleService from '@util/i18n/LocaleService';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class SearchCommand implements Command {
  public readonly TRIGGERS = ['search'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !search <tag>';

  private readonly localeService: LocaleService;
  private readonly db: DatabaseAdapter;

  constructor(localeService: LocaleService, db: DatabaseAdapter) {
    this.localeService = localeService;
    this.db = db;
  }

  public run(message: Message, params: string[]) {
    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const tag = params.shift()!;
    const results = getSounds().filter(sound => sound.includes(tag));
    this.db.sounds.withTag(tag).forEach(sound => results.push(sound));

    if (!results.length) {
      message.author.send(this.localeService.t('commands.search.notFound'));
      return;
    }

    const uniqueResults = [...new Set(results)].sort();
    message.author.send(uniqueResults.join('\n'));
  }
}
