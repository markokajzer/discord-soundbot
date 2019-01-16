import { Attachment, Message } from 'discord.js';

import Command from './base/Command';

import SoundUtil from '@util/SoundUtil';

export default class DownloadCommand implements Command {
  public readonly TRIGGERS = ['download'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !download <sound>';

  private readonly soundUtil: SoundUtil;

  constructor(soundUtil: SoundUtil) {
    this.soundUtil = soundUtil;
  }

  public run(message: Message, params: Array<string>) {
    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = params[0];
    if (!this.soundUtil.soundExists(sound)) return;

    const attachment = new Attachment(this.soundUtil.getPathForSound(sound));
    message.channel.send(attachment);
  }
}
