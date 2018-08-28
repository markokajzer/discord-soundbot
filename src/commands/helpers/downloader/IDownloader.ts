import { Message } from 'discord.js';

export default interface IDownloader {
  handle(message: Message): void;
}
