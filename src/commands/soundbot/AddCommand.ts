import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import AttachmentDownloader from '../helpers/downloader/AttachmentDownloader';
import IDownloader from '../helpers/downloader/IDownloader';
import YoutubeDownloader from '../helpers/downloader/YoutubeDownloader';

export default class AddCommand implements ICommand {
  public readonly TRIGGERS = ['add'];
  private readonly attachmentDownloader: AttachmentDownloader;
  private readonly youtubeDownloader: YoutubeDownloader;

  constructor(attachmentDownloader: AttachmentDownloader, youtubeDownloader: YoutubeDownloader) {
    this.attachmentDownloader = attachmentDownloader;
    this.youtubeDownloader = youtubeDownloader;
  }

  public run(message: Message) {
    let handler = this.attachmentDownloader as IDownloader;
    if (!message.attachments.size) handler = this.youtubeDownloader;
    handler.handle(message);
  }
}
