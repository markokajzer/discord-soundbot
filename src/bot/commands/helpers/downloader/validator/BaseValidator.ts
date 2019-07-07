import localize from '@util/i18n/localize';
import { existsSound } from '@util/SoundUtil';

export default abstract class BaseValidator {
  public abstract validate(...params: any[]): Promise<void[]>;

  protected validateName(name: string) {
    if (name.match(/[^a-z0-9]/)) {
      return Promise.reject(localize.t('validation.attachment.format'));
    }

    return Promise.resolve();
  }

  protected validateUniqueness(name: string) {
    if (existsSound(name)) {
      return Promise.reject(localize.t('validation.attachment.exists', { name }));
    }

    return Promise.resolve();
  }
}
