import config from '../../../config/config.json';

import { MessageAttachment } from 'discord.js';

import SoundUtil from '../../util/SoundUtil';

export default class AttachmentValidator {
  private acceptedExtensions: Array<string>;

  constructor(acceptedExtensions = config.acceptedExtensions) {
    this.acceptedExtensions = acceptedExtensions;
  }

  public validateAttachment(attachment: MessageAttachment) {
    const fileName = attachment.filename.toLowerCase();
    const soundName = fileName.substring(0, fileName.lastIndexOf('.'));

    this.validateExtension(fileName);
    this.validateName(soundName);
    this.validateSize(attachment.filesize, soundName);
    this.validateUniqueness(soundName);
  }

  private validateExtension(fileName: string) {
    if (!this.acceptedExtensions.some(ext => fileName.endsWith(ext))) {
      const extensions = this.acceptedExtensions.join(', ');
      throw new Error(`Sound has to be in accepted format, one of [${extensions}]!`);
    }
  }

  private validateName(soundName: string) {
    if (soundName.match(/[^a-z0-9]/)) {
      throw new Error('Filename has to be all letters and numbers!');
    }
  }

  private validateSize(filesize: number, soundName: string) {
    if (filesize > config.maximumFileSize) {
      throw new Error(`${soundName} is too big!`);
    }
  }

  private validateUniqueness(soundName: string) {
    if (SoundUtil.soundExists(soundName)) {
      throw new Error(`${soundName} already exists!`);
    }
  }
}
