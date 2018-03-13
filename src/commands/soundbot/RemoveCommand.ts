import fs from 'fs';
import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';
import CommandUsage from '../base/CommandUsage';

import SoundUtil from '../../util/SoundUtil';

export class RemoveCommand extends BaseCommand implements CommandUsage {
  public readonly USAGE = 'Usage: !remove <sound>';
  private readonly input: Array<string>;

  constructor(message: Message, input: Array<string>) {
    super(message);
    this.input = input;
  }

  public run() {
    if (this.input.length !== 1) {
      this.message.channel.send(this.USAGE);
      return;
    }

    const sound = this.input[0];
    if (!SoundUtil.soundExists(sound)) {
      this.message.channel.send(`${sound} not found!`);
      return;
    }

    const file = SoundUtil.getPathForSound(sound);
    fs.unlinkSync(file);
    this.message.channel.send(`${sound} removed!`);
  }
}
