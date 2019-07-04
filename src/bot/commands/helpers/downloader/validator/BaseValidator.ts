import LocaleService from '@util/i18n/LocaleService';
import { existsSound } from '@util/SoundUtil';

export default abstract class BaseValidator {
  protected readonly localeService: LocaleService;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public abstract validate(...params: any[]): Promise<void[]>;

  protected validateName(name: string) {
    if (name.match(/[^a-z0-9]/)) {
      return Promise.reject(this.localeService.t('validation.attachment.format'));
    }
  }

  protected validateUniqueness(name: string) {
    if (existsSound(name)) {
      return Promise.reject(this.localeService.t('validation.attachment.exists', { name }));
    }
  }
}
