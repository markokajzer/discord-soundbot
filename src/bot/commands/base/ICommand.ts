import { Message } from 'discord.js';

export default interface ICommand {
  readonly TRIGGERS: Array<string>;
  readonly NUMBER_OF_PARAMETERS?: number;
  readonly USAGE?: string;

  run(message: Message, params?: Array<string>): void;
}
