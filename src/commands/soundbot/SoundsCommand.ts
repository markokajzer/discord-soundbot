import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

import MessageChunker from '../../message/MessageChunker';
import SoundUtil from '../../util/SoundUtil';

export default class SoundsCommand implements ICommand {
  public readonly TRIGGERS = ['sounds'];
  private readonly chunker: MessageChunker;

  constructor(chunker = new MessageChunker()) {
    this.chunker = chunker;
  }

  public run(message: Message, params: Array<string>) {
    const sounds = SoundUtil.getSounds();

    if (!sounds.length) {
      message.author.send("You don't have any sounds yet! Try adding one with the !add command.");
      return;
    }

    this.chunker.chunkedMessages(sounds, params)
                .forEach(chunk => message.author.send(chunk));
  }
}
