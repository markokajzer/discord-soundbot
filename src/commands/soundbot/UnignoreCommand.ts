import { Message, Permissions } from 'discord.js';

import ICommand from '../base/ICommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';
import UserFinder from '../helpers/UserFinder';

export default class UnignoreCommand implements ICommand {
  public readonly TRIGGERS = ['unignore'];
  public readonly USAGE = 'Usage: !unignore <user>';
  private readonly db: DatabaseAdapter;
  private readonly userFinder: UserFinder;

  constructor(db: DatabaseAdapter, userFinder: UserFinder) {
    this.db = db;
    this.userFinder = userFinder;
  }

  public run(message: Message, _: Array<string>) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    this.userFinder.getUsersFromMentions(message, this.USAGE).forEach(user => {
      this.db.removeIgnoredUser(user.id);
      message.channel.send(`No longer ignoring ${user.username}!`);
    });
  }
}
