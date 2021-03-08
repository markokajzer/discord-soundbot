import { Message } from 'discord.js';

import * as entrances from '~/util/db/Entrances';
import { getSounds } from '~/util/SoundUtil';
import localize from '~/util/i18n/localize';

import Command from '../base/Command';

export class EntranceCommand extends Command {
  public readonly triggers = ['entrance'];

  public async run(message: Message, params: string[]) {
    const [entranceSound] = params;
    const { id: authorId } = await message.referencedAuthor();

    if (!entranceSound) {
      entrances.remove(authorId);
      return;
    }

    const sounds = getSounds();
    if (!sounds.includes(entranceSound)) {
      await message.edit(localize.t('errors.sounds.notFound', { sound: entranceSound }));
      return;
    }

    entrances.add(authorId, entranceSound);
  }
}
