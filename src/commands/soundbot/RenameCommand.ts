import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundUtil from '../../util/SoundUtil';

export class RenameCommand extends BaseCommand {
  protected readonly USAGE = 'Usage: !rename <old> <new>';
  private readonly input: Array<string>;

  constructor(message: Message, input: Array<string>) {
    super(message);
    this.input = input;
  }

  public run() {
    if (!this.message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (this.input.length !== 2) {
      this.message.channel.send(this.USAGE);
      return;
    }

    const [oldName, newName] = this.input;
    const sounds = SoundUtil.getSounds();

    if (!sounds.includes(oldName)) {
      this.message.channel.send(`${oldName} not found!`);
      return;
    }

    if (sounds.includes(newName)) {
      this.message.channel.send(`${newName} already exists!`);
      return;
    }

    const extension = SoundUtil.getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;
    fs.renameSync(oldFile, newFile);

    this.message.channel.send(`${oldName} renamed to ${newName}!`);
  }
}
