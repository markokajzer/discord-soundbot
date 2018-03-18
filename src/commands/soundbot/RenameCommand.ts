import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import ICommand from '../base/ICommand';

import SoundUtil from '../../util/SoundUtil';

export default class RenameCommand implements ICommand {
  public readonly TRIGGERS = ['rename'];
  public readonly USAGE = 'Usage: !rename <old> <new>';

  public run(message: Message, params: Array<string>) {
    if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (params.length !== 2) {
      message.channel.send(this.USAGE);
      return;
    }

    const [oldName, newName] = params;
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
