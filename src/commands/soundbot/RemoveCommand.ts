import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundUtil from '../../util/SoundUtil';

export default class RemoveCommand extends BaseCommand {
  public readonly TRIGGERS = ['remove'];
  protected readonly USAGE = 'Usage: !remove <sound>';

  public run(message: Message) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    const input = message.content.split(' ');
    if (input.length !== 1) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = input.shift()!;
    if (!SoundUtil.soundExists(sound)) {
      message.channel.send(`${sound} not found!`);
      return;
    }

    const file = SoundUtil.getPathForSound(sound);
    fs.unlinkSync(file);
    message.channel.send(`${sound} removed!`);
  }
}
