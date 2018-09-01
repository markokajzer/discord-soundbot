import { MessageAttachment } from 'discord.js';

import BaseValidator from './BaseValidator';

import Config from '@config/Config';
import LocaleService from '@util/i18n/LocaleService';

export default class AttachmentValidator extends BaseValidator {
  private readonly config: Config;

  constructor(config: Config, localeService: LocaleService) {
    super(localeService);
    this.config = config;
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
    if (!this.config.acceptedExtensions.some(ext => fileName.endsWith(ext))) {
      const extensions = this.config.acceptedExtensions.join(', ');
      return Promise.reject(this.localeService.t('validation.attachment.extension', { extensions }));
    }
  }

  private validateSize(filesize: number) {
    if (filesize > this.config.maximumFileSize) {
      return Promise.reject(this.localeService.t('validation.attachment.size'));
    }
  }
}
