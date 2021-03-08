import { Message } from 'discord.js';

import * as sounds from '~/util/db/Sounds';
import localize from '~/util/i18n/localize';
import { getSounds } from '~/util/SoundUtil';

import Command from '../base/Command';

export class TagCommand extends Command {
  public readonly triggers = ['tag'];
  public readonly numberOfParameters = 1;
  public readonly usage = 'Usage: !tag <sound> [<tag> ... <tagN> | clear]';
  public readonly elevated = true;

  public async run(message: Message, params: string[]) {
    if (params.length < this.numberOfParameters) {
      await message.edit(this.usage);
      return;
    }

    const sound = params.shift()!;
    if (!getSounds().includes(sound)) {
      await message.edit(localize.t('commands.tag.notFound', { sound }));
      return;
    }

    if (!params.length) {
      const tags = sounds.listTags(sound).join(', ');
      const author = await message.referencedAuthor();
      await author.send(localize.t('commands.tag.found', { sound, tags }));
      return;
    }

    if (params[0] === 'clear') {
      sounds.clearTags(sound);
      return;
    }

    sounds.addTags(sound, params);
  }
}
