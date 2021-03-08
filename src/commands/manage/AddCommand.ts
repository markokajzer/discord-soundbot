import { Message } from 'discord.js';

import Command from '../base/Command';
import AttachmentDownloader from './add/downloader/AttachmentDownloader';
import YoutubeDownloader from './add/downloader/YoutubeDownloader';

export class AddCommand extends Command {
  public readonly triggers = ['add'];
  private readonly attachmentDownloader: AttachmentDownloader;
  private readonly youtubeDownloader: YoutubeDownloader;

  constructor(attachmentDownloader: AttachmentDownloader, youtubeDownloader: YoutubeDownloader) {
    super();
    this.attachmentDownloader = attachmentDownloader;
    this.youtubeDownloader = youtubeDownloader;
  }

  public async run(message: Message, params: string[]) {
    const originalMsg = await message.referencedMessage();

    if (!originalMsg.attachments.size) {
      await this.youtubeDownloader.handle(message, params);
      return;
    }

    await this.attachmentDownloader.handle(message);
  }
}
