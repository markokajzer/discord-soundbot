import Command from "../Command";
import AttachmentDownloader from "./add/downloader/AttachmentDownloader";
import YoutubeDownloader from "./add/downloader/YoutubeDownloader";

export class AddCommand extends Command {
  public readonly triggers = ["add"];

  public async run(message: Message, params: string[]) {
    if (!message.attachments.size) {
      const youtubeDownloader = new YoutubeDownloader();
      youtubeDownloader.handle(message, params);

      return;
    }

    const attachmentDownloader = new AttachmentDownloader();
    attachmentDownloader.handle(message);
  }
}
