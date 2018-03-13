import IgnoreBaseCommand from '../base/IgnoreBaseCommand';

export class UnignoreCommand extends IgnoreBaseCommand {
  public readonly USAGE = 'Usage: !unignore <user>';

  public run() {
    const users = this.getUsersFromMentions();
    if (!users) return;

    users.forEach(user => {
      this.db.removeIgnoredUser(user.id);
      this.message.channel.send(`${user.username} no longer ignored!`);
    });
  }
}
