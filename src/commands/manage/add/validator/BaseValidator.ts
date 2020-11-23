/* eslint-disable max-classes-per-file */

import { DuplicationError, NameError } from '~/util/Errors';
import { existsSound } from '~/util/SoundUtil';

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
