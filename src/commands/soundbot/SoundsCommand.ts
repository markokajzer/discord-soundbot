import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

import SoundUtil from '../../util/SoundUtil';

export default class SoundsCommand implements ICommand {
  public readonly TRIGGERS = ['sounds'];

  public run(message: Message) {
    const response = SoundUtil.getSounds().join('\n');
    message.author.send(response);
  }
}
