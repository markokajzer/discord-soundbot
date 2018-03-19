import { prefix } from '../../../config/config.json';

import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

export default class HelpCommand implements ICommand {
  public readonly TRIGGERS = ['commands', 'help'];

  public run(message: Message) {
    message.author.send(this.getFormattedListOfCommands());
  }

  private getFormattedListOfCommands() {
    return [
      '```',
      `Use the prefix "${prefix}" with the following commands:`,
      '',
      'commands             Show this message',
      'sounds               Show available sounds',
      'tag <sound> <tag>    Add tag to sound',
      'search <tag>         Search for specific sound',
      'add                  Add the attached sound',
      '<sound>              Play the specified sound',
      'random               Play random sound',
      'rename <old> <new>   Rename specified sound',
      'remove <sound>       Remove specified sound',
      'stop                 Stop playing and clear queue',
      'leave                Leave the channel',
      'mostplayed           Show 15 most used sounds',
      'lastadded            Show 5 last added sounds',
      'ignore <user>        Ignore specified user',
      'unignore <user>      Unignore specified user',
      'avatar [remove]      Set, show or remove the avatar',
      '```'
    ].join('\n');
  }
}
