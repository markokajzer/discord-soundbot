import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundUtil from '../../util/SoundUtil';

export class SoundsCommand extends BaseCommand {
  constructor(message: Message) {
    super(message);
  }

  public run() {
    const response = SoundUtil.getSounds().join('\n');
    this.message.author.send(response);
  }
}
