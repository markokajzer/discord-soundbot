import { Message } from 'discord.js';

export default interface ICommand {
  run(message: Message): void;
}
