import fs from 'fs';
import { IncomingMessage } from 'http';
import https from 'https';

import { Message, MessageAttachment } from 'discord.js';

import localize from '@util/i18n/localize';
import BaseDownloader from './BaseDownloader';
import AttachmentValidator from './validator/AttachmentValidator';

export default class AttachmentDownloader extends BaseDownloader {
  protected readonly validator: AttachmentValidator;

  constructor(attachmentValidator: AttachmentValidator) {
    super();
    this.validator = attachmentValidator;
  }

  public handle(message: Message) {
    message.attachments.forEach(attachment =>
      this.validator
        .validate(attachment)
        .then(() => this.addSound(attachment))
        .then(response => message.channel.send(response))
        .catch(response => message.channel.send(response))
    );
  }

  private addSound(attachment: MessageAttachment) {
    return this.makeRequest(attachment.url)
      .then(response =>
        // Checked for attachment name during validation
        this.saveResponseToFile(response as IncomingMessage, attachment.name!.toLowerCase())
      )
      .then(name => Promise.resolve(localize.t('commands.add.success', { name })))
      .catch(this.handleError);
  }

  private makeRequest(url: string) {
    return new Promise((resolve, reject) => {
      https
        .get(url)
        .on('response', resolve)
        .on('error', reject);
    });
  }

  private saveResponseToFile(response: IncomingMessage, filename: string) {
    if (response.statusCode === 200) {
      response.pipe(fs.createWriteStream(`./sounds/${filename}`));
    }

    return Promise.resolve(filename.split('.')[0]);
  }

  private handleError(error: Error) {
    console.error(error);
    return Promise.reject(localize.t('commands.add.error'));
  }
}
