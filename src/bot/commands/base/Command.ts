import { Message } from 'discord.js';

export default interface Command {
  readonly TRIGGERS: string[];
  readonly NUMBER_OF_PARAMETERS?: number;
  readonly USAGE?: string;

  run(message: Message, params?: string[]): void;
}
