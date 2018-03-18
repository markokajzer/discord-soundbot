import { Message } from 'discord.js';

import ICommand from './ICommand';

export default abstract class BaseCommand implements ICommand {
  public abstract readonly TRIGGERS: Array<string>;
  protected readonly USAGE?: string;

  public abstract run(message: Message): void;
}
