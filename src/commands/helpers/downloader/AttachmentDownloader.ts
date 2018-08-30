import { Message, MessageAttachment } from 'discord.js';
import fs from 'fs';
import { IncomingMessage } from 'http';
import https from 'https';

import LocaleService from '../../../i18n/LocaleService';
import BaseDownloader from './BaseDownloader';
import AttachmentValidator from './validator/AttachmentValidator';

export default class AttachmentDownloader extends BaseDownloader {
  protected readonly validator: AttachmentValidator;

  constructor(localeService: LocaleService, attachmentValidator: AttachmentValidator) {
    super(localeService);
    this.validator = attachmentValidator;
  }

  public handle(message: Message) {
    message.attachments.forEach(attachment =>
      this.validator.validate(attachment)
        .then(() => this.addSound(attachment))
        .then(response => attachment.message.channel.send(response))
        .catch(response => attachment.message.channel.send(response)));
  }

  private addSound(attachment: MessageAttachment) {
    return this.makeRequest(attachment.url)
      .then(response => this.saveResponseToFile(response as IncomingMessage, attachment.filename.toLowerCase()))
      .then(name => Promise.resolve(this.localeService.t('add.success', { name })))
      .catch(error => this.handleError(error));
  }

  private makeRequest(url: string) {
    return new Promise((resolve, reject) => {
      https.get(url)
        .on('response', response => resolve(response))
        .on('error', error => reject(error));
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
    return Promise.reject(this.localeService.t('add.error'));
  }
}
