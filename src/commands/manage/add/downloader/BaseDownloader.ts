import { Message } from 'discord.js';

import localize from '~/util/i18n/localize';

import BaseValidator from '../validator/BaseValidator';

export default abstract class BaseDownloader {
  protected readonly validator!: BaseValidator;

  public abstract handle(message: Message, params: string[]): void;

  protected handleError(message: Message, error: Error) {
    if (error.name === 'ValidationError') {
      message.channel.send(error.message);
      return;
    }

    console.error(error);
    message.channel.send(localize.t('errors.unspecific'));
  }
}
