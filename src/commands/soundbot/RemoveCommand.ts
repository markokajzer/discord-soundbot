import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import ICommand from '../base/ICommand';

import SoundUtil from '../../util/SoundUtil';

export default class RemoveCommand implements ICommand {
  public readonly TRIGGERS = ['remove'];
  public readonly USAGE = 'Usage: !remove <sound>';

  public run(message: Message, params: Array<string>) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (params.length !== 1) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = params.shift()!;
    if (!SoundUtil.soundExists(sound)) {
      message.channel.send(`${sound} not found!`);
      return;
    }

    const file = SoundUtil.getPathForSound(sound);
    fs.unlinkSync(file);
    message.channel.send(`${sound} removed!`);
  }
}
