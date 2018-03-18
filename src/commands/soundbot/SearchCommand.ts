import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundUtil from '../../util/SoundUtil';

export default class SearchCommand extends BaseCommand {
  public readonly TRIGGERS = ['search'];
  protected readonly USAGE = 'Usage: !search <tag>';
  private readonly MINIMUM_TAG_LENGTH = 3;

  public run(message: Message) {
    const input = message.content.split(' ');
    if (input.length !== 1) {
      message.channel.send(this.USAGE);
      return;
    }

    const tag = input.shift()!;
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
