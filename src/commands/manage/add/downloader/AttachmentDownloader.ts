import fs from "node:fs";
import type { IncomingMessage } from "node:http";
import https from "node:https";
import type { Attachment } from "discord.js";

import { UnspecificError } from "~/util/Errors";
import localize from "~/util/i18n/localize";

import AttachmentValidator from "../validator/AttachmentValidator";
import BaseDownloader from "./BaseDownloader";

export default class AttachmentDownloader extends BaseDownloader {
  protected readonly validator: AttachmentValidator;

  constructor() {
    super();
    this.validator = new AttachmentValidator();
  }

  public async handle(message: Message) {
    this.validator.setConfig(message.client.config);

    try {
      await this.addSounds(message);
    } catch (error) {
      this.handleError(message, error as Error);
    }
  }

  private async addSounds(message: Message) {
    // NOTE: .forEach swallows exceptions in an async setup, so use for..of
    for (const attachment of message.attachments.values()) {
      this.validator.validate(attachment);

      await this.fetchAndSaveSound(attachment);

      const name = attachment.name.split(".")[0];
      message.channel.send(localize.t("commands.add.success", { name }));
    }
  }

  private async fetchAndSaveSound(attachment: Attachment) {
    const response = await this.downloadFile(attachment.url);
    this.saveResponseToFile(response, attachment.name.toLowerCase());
  }

  private downloadFile(url: string) {
    return new Promise<IncomingMessage>((resolve, reject) => {
      https.get(url).on("response", resolve).on("error", reject);
    });
  }

  private saveResponseToFile(response: IncomingMessage, filename: string) {
    if (response.statusCode !== 200) throw new UnspecificError();

    response.pipe(fs.createWriteStream(`./sounds/${filename}`));
  }
}
