import { Message, Permissions } from 'discord.js';

import ICommand from '../base/ICommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';
import LocaleService from '../../i18n/LocaleService';
import SoundUtil from '../../util/SoundUtil';

export default class TagCommand implements ICommand {
  public readonly TRIGGERS = ['tag'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !tag <sound> [<tag> ... <tagN> | clear]';
  private readonly localeService: LocaleService;
  private readonly db: DatabaseAdapter;

  constructor(localeService: LocaleService, db: DatabaseAdapter) {
    this.localeService = localeService;
    this.db = db;
  }

  public run(message: Message, params: Array<string>) {
    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = params.shift()!;
    if (!SoundUtil.getSounds().includes(sound)) {
      message.channel.send(this.localeService.t('tag.notFound', { sound }));
      return;
    }

    if (!params.length) {
      const tags = this.db.listTags(sound).join(', ');
      message.author.send(this.localeService.t('tag.found', { sound, tags }));
      return;
    }

    if (params[0] === 'clear') {
      if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;
      this.db.removeTags(sound);
      return;
    }

    this.db.addTags(sound, params);
  }
}
