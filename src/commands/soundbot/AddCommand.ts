import config from '../../../config/config.json';

import fs from 'fs';
import https from 'https';

import { MessageAttachment } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundUtil from '../../util/SoundUtil';

export class AddCommand extends BaseCommand {
  public run() {
    let error: string | undefined;
    this.message.attachments.forEach(attachment => {
      error = this.sanitizeAttachment(attachment);
    });

    if (error) {
      this.message.channel.send(error);
      return;
    }

    this.message.attachments.forEach(attachment => {
      this.addSound(attachment).then(result => {
        this.message.channel.send(result);
      });
    });
  }

  // @REVIEW Split into submethods.
  private sanitizeAttachment(attachment: MessageAttachment) {
    if (attachment.filesize > config.maximumFileSize) {
      return `${attachment.filename.split('.')[0]} is too big!`;
    }

    const fileName = attachment.filename.toLowerCase();
    if (!config.acceptedExtensions.some(ext => fileName.endsWith(ext))) {
      const extensions = config.acceptedExtensions.join(', ');
      return `Sound has to be in accepted format, one of [${extensions}]!`;
    }

    const soundName = fileName.substring(0, fileName.lastIndexOf('.'));
    if (soundName.match(/[^a-z0-9]/)) {
      return 'Filename has to be all letters and numbers!';
    }

    if (SoundUtil.soundExists(soundName)) {
      return `${soundName} already exists!`;
    }
  }

  private addSound(attachment: MessageAttachment) {
    return new Promise(resolve => {
      const fileName = attachment.filename.toLowerCase();
      const soundName = fileName.split('.')[0];
      https.get(attachment.url, response => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(`./sounds/${fileName}`);
          response.pipe(file);
          resolve(`${soundName} added!`);
        }
      }).on('error', () => resolve('Something went wrong!'));
    });
  }
}
