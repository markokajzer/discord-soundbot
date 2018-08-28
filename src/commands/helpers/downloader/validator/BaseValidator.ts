import LocaleService from '../../../../i18n/LocaleService';
import SoundUtil from '../../../../util/SoundUtil';

export default abstract class BaseValidator {
  protected readonly localeService: LocaleService;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public abstract validate(...param: Array<any>): Promise<Array<void>>;

  protected validateName(name: string) {
    if (name.match(/[^a-z0-9]/)) {
      const message = this.localeService.t('validation.attachment.format');
      return Promise.reject(message);
    }
  }

  protected validateUniqueness(name: string) {
    if (SoundUtil.soundExists(name)) {
      const message = this.localeService.t('validation.attachment.exists', { name: name });
      return Promise.reject(message);
    }
  }
}
