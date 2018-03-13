import IgnoreBaseCommand from '../base/IgnoreBaseCommand';

export class IgnoreCommand extends IgnoreBaseCommand {
  public readonly USAGE = 'Usage: !ignore <user>';

  public run() {
    const users = this.getUsersFromMentions();
    if (!users) return;

    users.forEach(user => {
      this.db.addIgnoredUser(user.id);
      this.message.channel.send(`${user.username} ignored!`);
    });
  }
}
