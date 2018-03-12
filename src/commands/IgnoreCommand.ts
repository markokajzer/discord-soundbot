import IgnoreBaseCommand from './IgnoreBaseCommand';

export class IgnoreCommand extends IgnoreBaseCommand {
  public readonly USAGE = 'Usage: !ignore <user>';

  public run() {
    const user = this.getUserFromInput();
    if (!user) return;

    const alreadyIgnored = this.db.isIgnoredUser(user.id);
    if (!alreadyIgnored) this.db.addIgnoredUser(user.id);
    this.message.channel.send(`${user.displayName} ignored!`);
  }
}
