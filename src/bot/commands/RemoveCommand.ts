import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import ICommand from './base/ICommand';

import DatabaseAdapter from '../../util/db/DatabaseAdapter';
import LocaleService from '../../util/i18n/LocaleService';
import SoundUtil from '../../util/SoundUtil';

export default class RemoveCommand implements ICommand {
  public readonly TRIGGERS = ['remove'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !remove <sound>';
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

    const sound = params.shift()!;
    if (!SoundUtil.soundExists(sound)) {
      message.channel.send(this.localeService.t('remove.notFound', { sound }));
      return;
    }

    const file = SoundUtil.getPathForSound(sound);
    fs.unlinkSync(file);
    this.db.sounds.remove(sound);

    message.channel.send(this.localeService.t('remove.success', { sound }));
  }
}
