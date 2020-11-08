import { Message } from 'discord.js';

import Command from '../base/Command';
import AttachmentDownloader from '../util/downloader/AttachmentDownloader';
import YoutubeDownloader from '../util/downloader/YoutubeDownloader';

export class AddCommand implements Command {
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
