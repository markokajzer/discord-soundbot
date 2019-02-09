import { Message, Permissions } from 'discord.js';

import Command from './base/Command';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import LocaleService from '@util/i18n/LocaleService';
import UserFinder from './helpers/UserFinder';

export default class UnignoreCommand implements Command {
  public readonly TRIGGERS = ['unignore'];
  public readonly USAGE = 'Usage: !unignore <user>';
  private readonly localeService: LocaleService;
  private readonly db: DatabaseAdapter;
  private readonly userFinder: UserFinder;

  constructor(localeService: LocaleService, db: DatabaseAdapter, userFinder: UserFinder) {
    this.localeService = localeService;
    this.db = db;
    this.userFinder = userFinder;
  }

  public run(message: Message) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    this.userFinder.getUsersFromMentions(message, this.USAGE).forEach(user => {
      this.db.ignoreList.remove(user.id);
      message.channel.send(this.localeService.t('commands.ignore.remove', { user: user.username }));
    });
  }
}
