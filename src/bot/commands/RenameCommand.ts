import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import ICommand from './base/ICommand';

import DatabaseAdapter from '../../util/db/DatabaseAdapter';
import LocaleService from '../../util/i18n/LocaleService';
import SoundUtil from '../../util/SoundUtil';

export default class RenameCommand implements ICommand {
  public readonly TRIGGERS = ['rename'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !rename <old> <new>';
  private readonly localeService: LocaleService;
  private readonly db: DatabaseAdapter;

  constructor(localeService: LocaleService, db: DatabaseAdapter) {
    this.localeService = localeService;
    this.db = db;
  }

  public run(message: Message, params: Array<string>) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const [oldName, newName] = params;
    const sounds = SoundUtil.getSounds();

    if (!sounds.includes(oldName)) {
      message.channel.send(this.localeService.t('rename.notFound', { oldName }));
      return;
    }

    if (sounds.includes(newName)) {
      message.channel.send(this.localeService.t('rename.exists', { newName }));
      return;
    }

    const extension = SoundUtil.getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;
    fs.renameSync(oldFile, newFile);
    this.db.renameSound(oldName, newName);

    message.channel.send(this.localeService.t('rename.success', { oldName, newName }));
  }
}
