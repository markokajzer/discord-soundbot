import { Message } from 'discord.js';
import fs from 'fs';

import * as soundsDb from '~/util/db/Sounds';
import localize from '~/util/i18n/localize';
import { getExtensionForSound, getSounds } from '~/util/SoundUtil';

import Command from '../base/Command';

export class RenameCommand extends Command {
  public readonly triggers = ['rename'];
  public readonly numberOfParameters = 2;
  public readonly usage = 'Usage: !rename <old> <new>';
  public readonly elevated = true;

  public async run(message: Message, params: string[]) {
    if (!message.reference!.guildID) return;

    if (params.length !== this.numberOfParameters) {
      await message.edit(this.usage);
      return;
    }

    const [oldName, newName] = params;
    const sounds = getSounds();

    if (!sounds.includes(oldName)) {
      await message.edit(localize.t('commands.rename.notFound', { oldName }));
      return;
    }

    if (sounds.includes(newName)) {
      await message.edit(localize.t('errors.sounds.exists', { sound: newName }));
      return;
    }

    const extension = getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;
    fs.renameSync(oldFile, newFile);
    soundsDb.rename(oldName, newName);

    await message.edit(localize.t('commands.rename.success', { newName, oldName }));
  }
}
