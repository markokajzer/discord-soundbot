import { Message, MessageAttachment } from 'discord.js';

import IDownloader from './IDownloader';

import SoundDownloader from '../SoundDownloader';
import AttachmentValidator from './validator/AttachmentValidator';

export default class AttachmentDownloader implements IDownloader {
  private readonly validator: AttachmentValidator;
  private readonly downloader: SoundDownloader;

  constructor(attachmentValidator: AttachmentValidator, downloader: SoundDownloader) {
    this.validator = attachmentValidator;
    this.downloader = downloader;
  }

  public handle(message: Message) {
    message.attachments.forEach(attachment =>
      this.saveValidAttachment(attachment).then(result => message.channel.send(result))
                                          .catch(result => message.channel.send(result)));
  }

  private saveValidAttachment(attachment: MessageAttachment) {
    return this.validator.validate(attachment)
                         .then(() => this.addSound(attachment));
  }

  private addSound(attachment: MessageAttachment) {
    const fileName = attachment.filename.toLowerCase();
    return this.downloader.download(fileName, attachment.url);
  }
}
