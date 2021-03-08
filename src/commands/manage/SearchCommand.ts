import { Message } from 'discord.js';

import * as sounds from '~/util/db/Sounds';
import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import Command from '../base/Command';

export class SearchCommand extends Command {
  public readonly triggers = ['search'];
  public readonly numberOfParameters = 1;
  public readonly usage = 'Usage: !search <tag>';

  public async run(message: Message, params: string[]) {
    if (params.length !== this.numberOfParameters) {
      await message.edit(this.usage);
      return;
    }

    const tag = params.shift()!;
    const results = getSounds().filter(sound => sound.includes(tag));
    const author = await message.referencedAuthor();
    sounds.withTag(tag).forEach(sound => results.push(sound));

    if (!results.length) {
      await author.send(localize.t('commands.search.notFound'));
    }

    const uniqueResults = [...new Set(results)].sort();
    await author.send(uniqueResults.join('\n'));
  }
}
