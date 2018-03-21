import { Message, MessageAttachment } from 'discord.js';

import ICommand from '../base/ICommand';

import AttachmentValidator from '../helpers/AttachmentValidator';
import SoundDownloader from '../helpers/SoundDownloader';

export default class AddCommand implements ICommand {
  public readonly TRIGGERS = ['add'];
  private readonly validator: AttachmentValidator;
  private readonly downloader: SoundDownloader;

  constructor(validator = new AttachmentValidator(), downloader = new SoundDownloader()) {
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
    const soundName = fileName.split('.')[0];

    return this.downloader.downloadSound(soundName, fileName, attachment.url);
  }
}
