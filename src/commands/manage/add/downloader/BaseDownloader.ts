import { Message } from 'discord.js';

import { FormatError, ValidationError } from '~/util/Errors';
import localize from '~/util/i18n/localize';

import BaseValidator from '../validator/BaseValidator';

const HANDLED_ERRORS = [FormatError.name, ValidationError.name];

export default abstract class BaseDownloader {
  protected abstract readonly validator: BaseValidator;

  public abstract handle(message: Message, params: string[]): void;

  protected async handleError(message: Message, error: Error) {
    if (HANDLED_ERRORS.includes(error.name)) {
      await message.edit(error.message);
      return;
    }

    console.error(error);
    await message.edit(localize.t('errors.unspecific'));
  }
}
