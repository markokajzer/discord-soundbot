import { Message } from 'discord.js';

import * as sounds from '@util/db/Sounds';
import localize from '@util/i18n/localize';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class SearchCommand implements Command {
  public readonly TRIGGERS = ['search'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !search <tag>';

  public run(message: Message, params: string[]) {
    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const tag = params.shift()!;
    const results = getSounds().filter(sound => sound.includes(tag));
    sounds.withTag(tag).forEach(sound => results.push(sound));

    if (!results.length) {
      message.author.send(localize.t('commands.search.notFound'));
      return;
    }

    const uniqueResults = [...new Set(results)].sort();
    message.author.send(uniqueResults.join('\n'));
  }
}
