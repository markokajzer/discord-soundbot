import { Message } from 'discord.js';

export default abstract class BaseCommand {
  protected readonly USAGE?: string;
  protected message: Message;

  constructor(message: Message) {
    this.message = message;
  }

  public abstract run(): void;
}
