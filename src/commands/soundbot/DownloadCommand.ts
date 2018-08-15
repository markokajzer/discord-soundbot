import { Attachment, Message } from 'discord.js';

import ICommand from '../base/ICommand';

import SoundUtil from '../../util/SoundUtil';

export default class DownloadCommand implements ICommand {
  public readonly TRIGGERS = ['download'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !download <sound>';

  public run(message: Message, params: Array<string>) {
    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = params[0];
    if (!SoundUtil.soundExists(sound)) return;

    const attachment = new Attachment(SoundUtil.getPathForSound(sound));
    message.channel.send(attachment);
  }
}
