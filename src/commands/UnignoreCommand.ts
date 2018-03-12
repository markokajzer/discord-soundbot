import IgnoreBaseCommand from './IgnoreBaseCommand';

export class UnignoreCommand extends IgnoreBaseCommand {
  public readonly USAGE = 'Usage: !unignore <user>';

  public run() {
    const user = this.getUserFromInput();
    if (!user) return;

    this.db.removeIgnoredUser(user.id);
    this.message.channel.send(`${user.displayName} no longer ignored!`);
  }
}
