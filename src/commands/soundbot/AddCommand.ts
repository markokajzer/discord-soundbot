import fs from 'fs';
import https from 'https';

import { Message, MessageAttachment } from 'discord.js';

import ICommand from '../base/ICommand';

import AttachmentValidator from '../helpers/AttachmentValidator';

export default class AddCommand implements ICommand {
  public readonly TRIGGERS = ['add'];

  public run(message: Message) {
    message.attachments.forEach(attachment =>
      message.channel.send(this.saveValidAttachment(attachment)));
  }

  private saveValidAttachment(attachment: MessageAttachment, validator = new AttachmentValidator()) {
    try {
      validator.validateAttachment(attachment);
    } catch (error) {
      return error.message;
    }

    this.addSound(attachment).then(result => result)
                             .catch(result => result);
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
