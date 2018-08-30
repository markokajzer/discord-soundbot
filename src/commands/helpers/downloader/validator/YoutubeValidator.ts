import URL from 'url';

import LocaleService from '../../../../i18n/LocaleService';
import BaseValidator from './BaseValidator';

export default class YoutubeValidator extends BaseValidator {
  private readonly VALID_HOSTS = ['www.youtube.com', 'youtu.be'];

  constructor(localeService: LocaleService) {
    super(localeService);
  }

  public validate(name: string, url: string) {
    return Promise.all([
      this.validateName(name),
      this.validateUniqueness(name),
      this.validateUrl(url),
      Promise.resolve()
    ]);
  }

  private validateUrl(link: string) {
    if (!this.VALID_HOSTS.includes(URL.parse(link).hostname!)) {
      return Promise.reject(this.localeService.t('validation.url.invalid'));
    }
  }
}
