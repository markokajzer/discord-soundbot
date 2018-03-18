import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundUtil from '../../util/SoundUtil';

export default class SoundsCommand extends BaseCommand {
  public readonly TRIGGERS = ['sounds'];

  public run(message: Message) {
    const response = SoundUtil.getSounds().join('\n');
    message.author.send(response);
  }
}
