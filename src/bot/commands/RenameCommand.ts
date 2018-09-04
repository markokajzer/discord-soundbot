import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import ICommand from './base/ICommand';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import LocaleService from '@util/i18n/LocaleService';
import SoundUtil from '@util/SoundUtil';

export default class RenameCommand implements ICommand {
  public readonly TRIGGERS = ['rename'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !rename <old> <new>';

  private readonly localeService: LocaleService;
  private readonly soundUtil: SoundUtil;
  private readonly db: DatabaseAdapter;

  constructor(localeService: LocaleService, soundUtil: SoundUtil, db: DatabaseAdapter) {
    this.localeService = localeService;
    this.soundUtil = soundUtil;
    this.db = db;
  }

  public run(message: Message, params: Array<string>) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const [oldName, newName] = params;
    const sounds = this.soundUtil.getSounds();

    if (!sounds.includes(oldName)) {
      message.channel.send(this.localeService.t('rename.notFound', { oldName }));
      return;
    }

    if (sounds.includes(newName)) {
      message.channel.send(this.localeService.t('rename.exists', { newName }));
      return;
    }

    const extension = this.soundUtil.getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;
    fs.renameSync(oldFile, newFile);
    this.db.sounds.rename(oldName, newName);

    message.channel.send(this.localeService.t('rename.success', { oldName, newName }));
  }
}
