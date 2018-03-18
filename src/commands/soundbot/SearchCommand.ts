import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

import SoundUtil from '../../util/SoundUtil';

export default class SearchCommand implements ICommand {
  public readonly TRIGGERS = ['search'];
  public readonly USAGE = 'Usage: !search <tag>';
  private readonly MINIMUM_TAG_LENGTH = 3;

  public run(message: Message, params: Array<string>) {
    if (params.length !== 1) {
      message.channel.send(this.USAGE);
      return;
    }

    const tag = params.shift()!;
    if (tag.length < this.MINIMUM_TAG_LENGTH) {
      message.channel.send('Search tag too short!');
      return;
    }

    const results = SoundUtil.getSounds().filter(sound => sound.includes(tag));
    if (!results.length) {
      message.author.send('No sounds found.');
      return;
    }

    message.author.send(results.join('\n'));
  }
}
