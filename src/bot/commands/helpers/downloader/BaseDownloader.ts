import { Message } from 'discord.js';

import BaseValidator from './validator/BaseValidator';

export default abstract class BaseDownloader {
  protected readonly validator!: BaseValidator;

  public abstract handle(message: Message): void;
}
