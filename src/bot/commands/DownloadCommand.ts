import { Message, MessageAttachment } from 'discord.js';

import { existsSound, getPathForSound } from '@util/SoundUtil';
import Command from './base/Command';

export default class DownloadCommand implements Command {
  public readonly TRIGGERS = ['download'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !download <sound>';

  public run(message: Message, params: string[]) {
    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = params[0];
    if (!existsSound(sound)) return;

    const attachment = new MessageAttachment(getPathForSound(sound));
    message.channel.send(attachment);
  }
}
