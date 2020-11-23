import { Message } from 'discord.js';

import { ValidationError } from '~/util/Errors';
import localize from '~/util/i18n/localize';

import BaseValidator from '../validator/BaseValidator';

export default abstract class BaseDownloader {
  protected abstract readonly validator: BaseValidator;

  public abstract handle(message: Message, params: string[]): void;

  protected handleError(message: Message, error: Error) {
    if (error.name === ValidationError.name) {
      message.channel.send(error.message);
      return;
    }

    console.error(error);
    message.channel.send(localize.t('errors.unspecific'));
  }
}
