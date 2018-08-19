import { MessageAttachment } from 'discord.js';

import config from '../../../config/config.json';

import LocaleService from '../../i18n/LocaleService';
import SoundUtil from '../../util/SoundUtil';

export default class AttachmentValidator {
  private readonly localeService: LocaleService;
  private acceptedExtensions: Array<string>;

  constructor(localeService: LocaleService, acceptedExtensions = config.acceptedExtensions) {
    this.localeService = localeService;
    this.acceptedExtensions = acceptedExtensions;
  }

  public validateAttachment(attachment: MessageAttachment) {
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
      const message = this.localeService.t('validation.attachment.extension', { extensions });
      return Promise.reject(message);
    }
  }

  private validateName(soundName: string) {
    if (soundName.match(/[^a-z0-9]/)) {
      const message = this.localeService.t('validation.attachment.format');
      return Promise.reject(message);
    }
  }

  private validateSize(filesize: number) {
    if (filesize > config.maximumFileSize) {
      const message = this.localeService.t('validation.attachment.size');
      return Promise.reject(message);
    }
  }

  private validateUniqueness(soundName: string) {
    if (SoundUtil.soundExists(soundName)) {
      const message = this.localeService.t('validation.attachment.exists', { name: soundName });
      return Promise.reject(message);
    }
  }
}
