import { Message, Permissions } from 'discord.js';

import ICommand from '../base/ICommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';
import UserFinder from '../helpers/UserFinder';

export default class IgnoreCommand implements ICommand {
  public readonly TRIGGERS = ['ignore'];
  public readonly USAGE = 'Usage: !ignore <user>';
  private readonly db: DatabaseAdapter;

  constructor(db: DatabaseAdapter) {
    this.db = db;
  }

  public run(message: Message, _: Array<string>, userFinder = new UserFinder()) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    userFinder.getUsersFromMentions(message, this.USAGE).forEach(user => {
      this.db.addIgnoredUser(user.id);
      message.channel.send(`Ignoring ${user.username}!`);
    });
  }
}
