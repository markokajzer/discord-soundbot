import { Message, Permissions } from 'discord.js';

import ICommand from '../base/ICommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';
import UserFinder from '../helpers/UserFinder';

export default class UnignoreCommand implements ICommand {
  public readonly TRIGGERS = ['unignore'];
  public readonly USAGE = 'Usage: !unignore <user>';
  private readonly db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  public run(message: Message, _: Array<string>, userFinder = new UserFinder()) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    userFinder.getUsersFromMentions(message, this.USAGE).forEach(user => {
      this.db.removeIgnoredUser(user.id);
      message.channel.send(`No longer ignoring ${user.username}!`);
    });
  }
}
