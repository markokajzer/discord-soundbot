import { Message } from 'discord.js';

export default abstract class BaseCommand {
  protected message: Message;

  constructor(message: Message) {
    this.message = message;
  }

  public abstract run(): void;
}
