import { prefix } from '../../../config/config.json';

import BaseCommand from '../base/BaseCommand';

export class CommandListCommand extends BaseCommand {
  public run() {
    this.message.author.send(this.getListOfCommands());
  }

  private getListOfCommands() {
    return [
      '```',
      `Use the prefix "${prefix}" with the following commands:`,
      '',
      'commands             Show this message',
      'sounds               Show available sounds',
      'mostplayed           Show 15 most used sounds',
      'lastadded            Show 5 last added sounds',
      '<sound>              Play the specified sound',
      'random               Play random sound',
      'stop                 Stop playing and clear queue',
      'leave                Leave the channel',
      'add                  Add the attached sound',
      'rename <old> <new>   Rename specified sound',
      'remove <sound>       Remove specified sound',
      'ignore <user>        Ignore specified user',
      'unignore <user>      Unignore specified user',
      '```'
    ].join('\n');
  }
}
