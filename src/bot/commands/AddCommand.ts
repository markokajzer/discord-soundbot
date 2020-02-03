import { Message } from 'discord.js';

import Command from './base/Command';

import AttachmentDownloader from './helpers/downloader/AttachmentDownloader';
import YoutubeDownloader from './helpers/downloader/YoutubeDownloader';

export default class AddCommand implements Command {
  public readonly TRIGGERS = ['add'];
  private readonly attachmentDownloader: AttachmentDownloader;
  private readonly youtubeDownloader: YoutubeDownloader;

  constructor(attachmentDownloader: AttachmentDownloader, youtubeDownloader: YoutubeDownloader) {
    this.attachmentDownloader = attachmentDownloader;
    this.youtubeDownloader = youtubeDownloader;
  }

  public run(message: Message, params: string[]) {
    if (!message.attachments.size) {
      this.youtubeDownloader.handle(message, params);
      return;
    }

    this.attachmentDownloader.handle(message);
  }
}
