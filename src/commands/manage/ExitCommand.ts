import { Message } from 'discord.js';

import * as exits from '~/util/db/Exits';
import { getSounds } from '~/util/SoundUtil';
import localize from '~/util/i18n/localize';

import Command from '../base/Command';

export class ExitCommand extends Command {
  public readonly triggers = ['exit'];

  public async run(message: Message, params: string[]) {
    const [exitSound] = params;
    const { id: authorId } = await message.referencedAuthor();
    if (!exitSound) {
      exits.remove(authorId);
      return;
    }

    const sounds = getSounds();
    if (!sounds.includes(exitSound)) {
      await message.edit(localize.t('errors.sounds.notFound', { sound: exitSound }));
      return;
    }

    exits.add(authorId, exitSound);
  }
}
