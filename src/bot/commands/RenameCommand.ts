import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import * as soundsDb from '@util/db/Sounds';
import LocaleService from '@util/i18n/LocaleService';
import { getExtensionForSound, getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class RenameCommand implements Command {
  public readonly TRIGGERS = ['rename'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !rename <old> <new>';

  private readonly localeService: LocaleService;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public run(message: Message, params: string[]) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const [oldName, newName] = params;
    const sounds = getSounds();

    if (!sounds.includes(oldName)) {
      message.channel.send(this.localeService.t('commands.rename.notFound', { oldName }));
      return;
    }

    if (sounds.includes(newName)) {
      message.channel.send(this.localeService.t('commands.rename.exists', { newName }));
      return;
    }

    const extension = getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;
    fs.renameSync(oldFile, newFile);
    soundsDb.rename(oldName, newName);

    message.channel.send(this.localeService.t('commands.rename.success', { oldName, newName }));
  }
}
