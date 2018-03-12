import { Message } from 'discord.js';

import BaseCommand from './BaseCommand';
import CommandUsage from './CommandUsage';

import Adapter from '../db/Adapter';

export default abstract class IgnoreBaseCommand extends BaseCommand implements CommandUsage {
  public USAGE = '';
  protected db: Adapter;
  protected input: Array<string>;

  constructor(message: Message, db: Adapter, input: Array<string>) {
    super(message);
    this.db = db;
    this.input = input;
  }

  protected getUserFromInput() {
    if (this.input.length !== 1) {
      this.message.channel.send(this.USAGE);
      return;
    }

    const id = this.input.shift()!;
    const user = this.message.guild.member(id);
    if (user) return user;

    this.message.channel.send('User not found on this server.');
  }
}
