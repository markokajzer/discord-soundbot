import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import LocaleService from '@util/i18n/LocaleService';
import { existsSound, getPathForSound } from '@util/SoundUtil';
import Command from './base/Command';

export default class RemoveCommand implements Command {
  public readonly TRIGGERS = ['remove'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !remove <sound>';

  private readonly localeService: LocaleService;
  private readonly db: DatabaseAdapter;

  constructor(localeService: LocaleService, db: DatabaseAdapter) {
    this.localeService = localeService;
    this.db = db;
  }

  public run(message: Message, params: string[]) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = params.shift()!;
    if (!existsSound(sound)) {
      message.channel.send(this.localeService.t('commands.remove.notFound', { sound }));
      return;
    }

    const file = getPathForSound(sound);
    fs.unlinkSync(file);
    this.db.sounds.remove(sound);

    message.channel.send(this.localeService.t('commands.remove.success', { sound }));
  }
}
