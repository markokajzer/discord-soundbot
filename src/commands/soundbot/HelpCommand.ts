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
      'add                  Add the attached sound',
      '<sound>              Play the specified sound',
      'random               Play random sound',
      'rename <old> <new>   Rename specified sound',
      'remove <sound>       Remove specified sound',
      'download <sound>     Send specified sound to chat',
      'stop                 Stop playing and clear queue',
      'leave                Leave the channel',
      'tag <sound> <tag>    Add tag to sound',
      'tag <sound>          List tags of specified sound',
      'tag <sound> clear    Clear tags of specified sound',
      'tags                 List all sounds with tags',
      'search <tag>         Search sounds with specified tag',
      'mostplayed           Show 15 most used sounds',
      'lastadded            Show 5 last added sounds',
      'ignore <user>        Ignore specified user',
      'unignore <user>      Unignore specified user',
      'avatar [remove]      Set, show or remove the avatar',
      '```'
    ].join('\n');
  }
}
