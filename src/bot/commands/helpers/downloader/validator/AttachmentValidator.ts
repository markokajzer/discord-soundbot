import { MessageAttachment } from 'discord.js';

import config from '@config/config.json';

import LocaleService from '@util/i18n/LocaleService';
import BaseValidator from './BaseValidator';

export default class AttachmentValidator extends BaseValidator {
  private readonly acceptedExtensions: Array<string>;

  constructor(localeService: LocaleService, acceptedExtensions = config.acceptedExtensions) {
    super(localeService);
    this.acceptedExtensions = acceptedExtensions;
  }

  public validate(attachment: MessageAttachment) {
    return this.validateAttachment(attachment);
  }

  private validateAttachment(attachment: MessageAttachment) {
    const fileName = attachment.filename.toLowerCase();
    const soundName = fileName.substring(0, fileName.lastIndexOf('.'));

    return Promise.all([
      this.validateExtension(fileName),
      this.validateName(soundName),
      this.validateSize(attachment.filesize),
      this.validateUniqueness(soundName),
      Promise.resolve()
    ]);
  }

  private validateExtension(fileName: string) {
    if (!this.acceptedExtensions.some(ext => fileName.endsWith(ext))) {
      const extensions = this.acceptedExtensions.join(', ');
      return Promise.reject(this.localeService.t('validation.attachment.extension', { extensions }));
    }
  }

  private validateSize(filesize: number) {
    if (filesize > config.maximumFileSize) {
      return Promise.reject(this.localeService.t('validation.attachment.size'));
    }
  }
}
