import { Message } from 'discord.js';
import fs from 'fs';

import * as soundsDb from '~/util/db/Sounds';
import localize from '~/util/i18n/localize';
import { getExtensionForSound, getSounds } from '~/util/SoundUtil';

import Command from '../base/Command';
import userHasElevatedRole from '../util/userHasElevatedRole';

export class RenameCommand extends Command {
  public readonly triggers = ['rename'];
  public readonly numberOfParameters = 2;
  public readonly usage = 'Usage: !rename <old> <new>';

  public run(message: Message, params: string[]) {
    if (!message.member) return;

    const allowedToRunCommand = userHasElevatedRole(message.member);
    if (!allowedToRunCommand) return;

    if (params.length !== this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const [oldName, newName] = params;
    const sounds = getSounds();

    if (!sounds.includes(oldName)) {
      message.channel.send(localize.t('commands.rename.notFound', { oldName }));
      return;
    }

    if (sounds.includes(newName)) {
      message.channel.send(localize.t('commands.rename.exists', { newName }));
      return;
    }

    const extension = getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;
    fs.renameSync(oldFile, newFile);
    soundsDb.rename(oldName, newName);

    message.channel.send(localize.t('commands.rename.success', { oldName, newName }));
  }
}
