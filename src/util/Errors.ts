import localize from './i18n/localize';

export class UnspecificError extends Error {
  name = 'UnspecificError';
  constructor() {
    super(localize.t('errors.unspecific'));
  }
}
