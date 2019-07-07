import URL from 'url';

import localize from '@util/i18n/localize';
import BaseValidator from './BaseValidator';

export default class YoutubeValidator extends BaseValidator {
  private readonly VALID_HOSTS = ['www.youtube.com', 'youtu.be'];

  public validate(name: string, url: string) {
    return Promise.all([
      this.validateName(name),
      this.validateUniqueness(name),
      this.validateUrl(url)
    ]);
  }

  private validateUrl(link: string) {
    if (!this.VALID_HOSTS.includes(URL.parse(link).hostname!)) {
      return Promise.reject(localize.t('validation.url.invalid'));
    }

    return Promise.resolve();
  }
}
