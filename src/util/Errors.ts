/* eslint-disable max-classes-per-file */

import localize from './i18n/localize';

export class FormatError extends Error {
  name = 'FormatError';
  constructor() {
    super(localize.t('errors.format.time'));
  }
}

export class UnspecificError extends Error {
  name = 'UnspecificError';
  constructor() {
    super(localize.t('errors.unspecific'));
  }
}

// Validation
export class ValidationError extends Error {
  name = 'ValidationError';
}

export class AttachmentExtensionError extends ValidationError {
  constructor(extensions: string[]) {
    super(localize.t('validation.attachment.extension', { extensions: extensions.join(', ') }));
  }
}

export class AttachmentSizeError extends ValidationError {
  constructor() {
    super(localize.t('validation.attachment.size'));
  }
}

export class DuplicationError extends ValidationError {
  constructor(sound: string) {
    super(localize.t('errors.sounds.exists', { sound }));
  }
}

export class InvalidUrlError extends ValidationError {
  constructor() {
    super(localize.t('errors.format.url'));
  }
}

export class NameError extends ValidationError {
  constructor() {
    super(localize.t('errors.format.sound'));
  }
}
