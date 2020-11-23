import { Message, MessageAttachment } from 'discord.js';
import fs from 'fs';
import { IncomingMessage } from 'http';
import https from 'https';

import { UnspecificError } from '~/util/Errors';
import localize from '~/util/i18n/localize';

import AttachmentValidator from '../validator/AttachmentValidator';
import BaseDownloader from './BaseDownloader';

export default class AttachmentDownloader extends BaseDownloader {
  protected readonly validator: AttachmentValidator;

  constructor(attachmentValidator: AttachmentValidator) {
    super();
    this.validator = attachmentValidator;
  }

  public async handle(message: Message) {
    try {
      await this.addSounds(message);
    } catch (error) {
      this.handleError(message, error);
    }
  }

  private async addSounds(message: Message) {
    // NOTE: .forEach swallows exceptions in an async setup, so use for..of
    for (const attachment of message.attachments.array()) {
      this.validator.validate(attachment);

      // NOTE: This could be optimized, but it is okay to do it in succession and code is cleaner
      // eslint-disable-next-line no-await-in-loop
      await this.fetchAndSaveSound(attachment);

      // NOTE: Checked for attachment name during validation
      const name = attachment.name!.split('.')[0];
      message.channel.send(localize.t('commands.add.success', { name }));
    }
  }

  private async fetchAndSaveSound(attachment: MessageAttachment) {
    const response = await this.downloadFile(attachment.url);
    this.saveResponseToFile(response, attachment.name!.toLowerCase());
  }

  private downloadFile(url: string) {
    return new Promise<IncomingMessage>((resolve, reject) => {
      https.get(url).on('response', resolve).on('error', reject);
    });
  }

  private saveResponseToFile(response: IncomingMessage, filename: string) {
    if (response.statusCode !== 200) throw new UnspecificError();

    response.pipe(fs.createWriteStream(`./sounds/${filename}`));
  }
}
