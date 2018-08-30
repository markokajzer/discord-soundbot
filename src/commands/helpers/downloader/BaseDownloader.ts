import { Message } from 'discord.js';

import LocaleService from '../../../i18n/LocaleService';
import BaseValidator from './validator/BaseValidator';

export default abstract class BaseDownloader {
  protected readonly localeService: LocaleService;
  protected readonly validator!: BaseValidator;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public abstract handle(message: Message): void;
}
