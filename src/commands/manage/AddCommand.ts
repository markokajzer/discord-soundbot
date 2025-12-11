import Command from "../base/Command";
import type AttachmentDownloader from "./add/downloader/AttachmentDownloader";
import type YoutubeDownloader from "./add/downloader/YoutubeDownloader";

export class AddCommand extends Command {
  public readonly triggers = ["add"];
  private readonly attachmentDownloader: AttachmentDownloader;
  private readonly youtubeDownloader: YoutubeDownloader;

  constructor(attachmentDownloader: AttachmentDownloader, youtubeDownloader: YoutubeDownloader) {
    super();
    this.attachmentDownloader = attachmentDownloader;
    this.youtubeDownloader = youtubeDownloader;
  }

  public async run(message: Message, params: string[]) {
    if (!message.attachments.size) {
      this.youtubeDownloader.handle(message, params);
      return;
    }

    this.attachmentDownloader.handle(message);
  }
}
