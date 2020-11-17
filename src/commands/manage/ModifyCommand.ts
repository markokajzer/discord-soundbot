import { Message } from 'discord.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

import localize from '~/util/i18n/localize';
import { existsSound, getExtensionForSound } from '~/util/SoundUtil';

import Command from '../base/Command';

interface CommandParams {
  usage: string;
  parameters: number;
}

const MODIFIER_OPTIONS: Dictionary<CommandParams> = {
  volume: {
    usage: 'Usage: !modify <sound> volume 1',
    parameters: 1
  }
};

export class ModifyCommand extends Command {
  public readonly triggers = ['modify', 'change'];

  public run(message: Message, params: string[]) {
    const [sound, modifier, ...commandParams] = params;
    if (!existsSound(sound)) return;

    const options = MODIFIER_OPTIONS[modifier];
    if (!options) {
      message.channel.send(localize.t('commands.modify.notFound', { modifier }));
      return;
    }

    if (commandParams.length < options.parameters || commandParams.length > options.parameters) {
      message.channel.send(options.usage);
      return;
    }

    const { currentFile, newFile } = this.getFileNameFor(sound);

    this.performModification(currentFile, newFile, modifier, commandParams)
      .then(() => this.replace(newFile, currentFile))
      .then(() => message.channel.send(localize.t('commands.modify.success', { modifier, sound })))
      .catch(() => message.channel.send(localize.t('commands.modify.error', { modifier, sound })));
  }

  private performModification(
    currentFile: string,
    newFile: string,
    modifier: string,
    params: string[]
  ) {
    switch (modifier) {
      case 'volume':
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.modifyVolume(currentFile, newFile, ...params);
      default:
        return Promise.reject();
    }
  }

  private modifyVolume(currentFile: string, newFile: string, value: string) {
    const ffmpegCommand = ffmpeg(currentFile)
      .audioFilters([{ filter: 'volume', options: value }])
      .output(newFile);

    return new Promise((resolve, reject) =>
      ffmpegCommand.on('end', resolve).on('error', reject).run()
    );
  }

  private replace(oldFile: string, newFile: string) {
    fs.renameSync(oldFile, newFile);

    return Promise.resolve();
  }

  private getFileNameFor(sound: string) {
    const extension = getExtensionForSound(sound);
    const currentFile = `./sounds/${sound}.${extension}`;

    const timestamp = Date.now();
    const newFile = `./sounds/${sound}-${timestamp}.${extension}`;

    return { currentFile, newFile };
  }
}
