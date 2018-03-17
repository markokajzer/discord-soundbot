import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundUtil from '../../util/SoundUtil';

export class SearchCommand extends BaseCommand {
  protected readonly USAGE = 'Usage: !search <tag>';
  private readonly MINIMUM_TAG_LENGTH = 3;
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

    const tag = this.input[0];
    if (tag.length < this.MINIMUM_TAG_LENGTH) {
      this.message.channel.send('Search tag too short!');
      return;
    }

    const results = SoundUtil.getSounds().filter(sound => sound.includes(tag));
    if (results.length === 0) {
      this.message.author.send('No sounds found.');
      return;
    }

    this.message.author.send(results.join('\n'));
  }
}
