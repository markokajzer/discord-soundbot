import config from '../../../config/config.json';

import { MessageAttachment } from 'discord.js';

import SoundUtil from '../../util/SoundUtil';

export default class AttachmentValidator {
  public validAttachment(attachment: MessageAttachment) {
    const fileName = attachment.filename.toLowerCase();
    const soundName = fileName.substring(0, fileName.lastIndexOf('.'));

    const error = this.hasValidExtension(fileName) ||
                  this.hasValidName(soundName) ||
                  this.hasValidSize(attachment.filesize, soundName) ||
                  this.hasUniqueName(soundName);
    return error;
  }

  private hasValidExtension(fileName: string) {
    if (!config.acceptedExtensions.some(ext => fileName.endsWith(ext))) {
      const extensions = config.acceptedExtensions.join(', ');
      return `Sound has to be in accepted format, one of [${extensions}]!`;
    }
  }

  private hasValidName(soundName: string) {
    if (soundName.match(/[^a-z0-9]/)) {
      return 'Filename has to be all letters and numbers!';
    }
  }

  private hasValidSize(filesize: number, soundName: string) {
    if (filesize > config.maximumFileSize) {
      return `${soundName} is too big!`;
    }
  }

  private hasUniqueName(soundName: string) {
    if (SoundUtil.soundExists(soundName)) {
      return `${soundName} already exists!`;
    }
  }
}
