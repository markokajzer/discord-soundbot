/* eslint-disable max-classes-per-file */

import URL from 'url';

import { InvalidUrlError } from '~/util/Errors';

import BaseValidator from './BaseValidator';

export default class YoutubeValidator extends BaseValidator {
  private readonly VALID_HOSTS = ['www.youtube.com', 'youtu.be'];

  public validate(name: string, url: string) {
    this.validateName(name);
    this.validateUniqueness(name);
    this.validateUrl(url);
  }

  private validateUrl(link: string) {
    const { hostname } = URL.parse(link);
    if (hostname && this.VALID_HOSTS.includes(hostname)) return;

    throw new InvalidUrlError();
  }
}
