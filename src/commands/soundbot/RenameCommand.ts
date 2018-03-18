import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundUtil from '../../util/SoundUtil';

export default class RenameCommand extends BaseCommand {
  public readonly TRIGGERS = ['rename'];
  protected readonly USAGE = 'Usage: !rename <old> <new>';

  public run(message: Message) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    const input = message.content.split(' ');
    if (input.length !== 2) {
      message.channel.send(this.USAGE);
      return;
    }

    const [oldName, newName] = input;
    const sounds = SoundUtil.getSounds();

    if (!sounds.includes(oldName)) {
      message.channel.send(`${oldName} not found!`);
      return;
    }

    if (sounds.includes(newName)) {
      message.channel.send(`${newName} already exists!`);
      return;
    }

    const extension = SoundUtil.getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;
    fs.renameSync(oldFile, newFile);

    message.channel.send(`${oldName} renamed to ${newName}!`);
  }
}
