import LocaleService from '@util/i18n/LocaleService';
import SoundUtil from '@util/SoundUtil';

export default abstract class BaseValidator {
  protected readonly localeService: LocaleService;
  private readonly soundUtil: SoundUtil;

  constructor(localeService: LocaleService, soundUtil: SoundUtil) {
    this.localeService = localeService;
    this.soundUtil = soundUtil;
  }

  public abstract validate(...params: any[]): Promise<void[]>;

  protected validateName(name: string) {
    if (name.match(/[^a-z0-9]/)) {
      return Promise.reject(this.localeService.t('validation.attachment.format'));
    }
  }

  protected validateUniqueness(name: string) {
    if (this.soundUtil.soundExists(name)) {
      return Promise.reject(this.localeService.t('validation.attachment.exists', { name }));
    }
  }
}
