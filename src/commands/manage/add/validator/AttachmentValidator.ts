import type { Attachment } from "discord.js";
import type Config from "~/config/Config";
import { AttachmentExtensionError, AttachmentSizeError } from "~/util/Errors";
import BaseValidator from "./BaseValidator";

export default class AttachmentValidator extends BaseValidator {
  // @ts-expect-error -- Handled via `setConfig` and `throw` in `validate`
  private config: Config;

  public setConfig(config: Config) {
    this.config = config;
  }

  public validate(attachment: Attachment) {
    if (!this.config) throw new Error("Configuration not set.");

    return this.validateAttachment(attachment);
  }

  private validateAttachment(attachment: Attachment) {
    const fileName = attachment.name.toLowerCase();
    const soundName = fileName.substring(0, fileName.lastIndexOf("."));

    this.validateExtension(fileName);
    this.validateName(soundName);
    this.validateSize(attachment.size);
    this.validateUniqueness(soundName);
  }

  private validateExtension(fileName: string) {
    if (this.config.acceptedExtensions.some((ext) => fileName.endsWith(ext))) return;

    throw new AttachmentExtensionError(this.config.acceptedExtensions);
  }

  private validateSize(filesize: number) {
    if (filesize <= this.config.maximumFileSize) return;

    throw new AttachmentSizeError();
  }
}
