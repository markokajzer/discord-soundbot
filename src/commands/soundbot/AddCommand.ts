import fs from 'fs';
import https from 'https';

import { MessageAttachment } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import AttachmentValidator from '../helpers/AttachmentValidator';

export class AddCommand extends BaseCommand {
  public run() {
    this.message.attachments.forEach(attachment =>
      this.saveValidAttachment(attachment));
  }

  private saveValidAttachment(attachment: MessageAttachment, validator = new AttachmentValidator()) {
    const error = validator.validAttachment(attachment);
    if (error) {
      this.message.channel.send(error);
      return;
    }

    this.addSound(attachment)
      .then(result => this.message.channel.send(result))
      .catch(result => this.message.channel.send(result));
  }

  private addSound(attachment: MessageAttachment) {
    return new Promise((resolve, reject) => {
      const fileName = attachment.filename.toLowerCase();
      const soundName = fileName.split('.')[0];
      https.get(attachment.url, response => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(`./sounds/${fileName}`);
          response.pipe(file);
          resolve(`${soundName} added!`);
        }
      }).on('error', error => {
        console.error(error);
        reject('Something went wrong!');
      });
    });
  }
}
