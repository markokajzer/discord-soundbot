import { Message } from 'discord.js';

import * as sounds from '~/util/db/Sounds';
import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import Command from '../base/Command';

export class SearchCommand extends Command {
  public readonly triggers = ['search'];
  public readonly numberOfParameters = 1;
  public readonly usage = 'Usage: !search <tag>';

  public run(message: Message, params: string[]) {
    if (params.length !== this.numberOfParameters) {
      message.channel.send(this.usage);
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
