/* eslint-disable max-classes-per-file */

import localize from '~/util/i18n/localize';
import { existsSound } from '~/util/SoundUtil';

export class ValidationError extends Error {
  name = 'ValidationError';
}

export class NameError extends ValidationError {
  constructor() {
    super(localize.t('errors.format.sound'));
  }
}

export class DuplicationError extends ValidationError {
  constructor(name: string) {
    super(localize.t('validation.attachment.exists', { name }));
  }
}

export default abstract class BaseValidator {
  public abstract validate(...params: unknown[]): void;

  protected validateName(name: string) {
    if (!name.match(/[^a-z0-9]/)) return;

    throw new NameError();
  }

  protected validateUniqueness(name: string) {
    if (!existsSound(name)) return;

    throw new DuplicationError(name);
  }
}
