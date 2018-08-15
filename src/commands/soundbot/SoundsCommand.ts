import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

import SoundUtil from '../../util/SoundUtil';

export default class SoundsCommand implements ICommand {
  public readonly TRIGGERS = ['sounds'];

  public run(message: Message) {
    const sounds = SoundUtil.getSounds();

    if (!sounds.length) {
      message.author.send('You don\'t have any sounds yet! Try adding with with the !add command.');
      return;
    }

    message.author.send(sounds.join('\n'));
  }
}
