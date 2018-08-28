import { Message, MessageAttachment } from 'discord.js';

import ICommand from './base/ICommand';

import AttachmentValidator from '../helpers/AttachmentValidator';
import SoundDownloader from '../helpers/SoundDownloader';

export default class AddCommand implements ICommand {
  public readonly TRIGGERS = ['add'];
  private readonly validator: AttachmentValidator;
  private readonly downloader: SoundDownloader;

  constructor(validator: AttachmentValidator, downloader: SoundDownloader) {
    this.validator = validator;
    this.downloader = downloader;
  }

  public run(message: Message) {
    message.attachments.forEach(attachment =>
      this.saveValidAttachment(attachment).then(result => message.channel.send(result))
                                          .catch(result => message.channel.send(result)));
  }

  private saveValidAttachment(attachment: MessageAttachment) {
    return this.validator.validateAttachment(attachment)
                         .then(() => this.addSound(attachment));
  }

  private addSound(attachment: MessageAttachment) {
    const fileName = attachment.filename.toLowerCase();
    return this.downloader.download(fileName, attachment.url);
  }
}
