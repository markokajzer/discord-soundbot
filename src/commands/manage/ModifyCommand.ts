import { Message } from 'discord.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

import getSecondsFromTime from '~/util/getSecondsFromTime';
import localize from '~/util/i18n/localize';
import { existsSound, getExtensionForSound } from '~/util/SoundUtil';

import Command from '../base/Command';

interface CommandParams {
  usage: string;
  parameters: { max: number; min: number };
}

const MODIFIER_OPTIONS: Dictionary<CommandParams> = {
  clip: {
    parameters: { max: 2, min: 1 },
    usage: 'Usage: !modify <sound> clip 14 18'
  },
  volume: {
    parameters: { max: 1, min: 1 },
    usage: 'Usage: !modify <sound> volume 1'
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

    if (
      commandParams.length < options.parameters.min ||
      commandParams.length > options.parameters.max
    ) {
      message.channel.send(options.usage);
      return;
    }

    const { currentFile, newFile } = this.getFileNameFor(sound);

    this.performModification(currentFile, newFile, modifier, commandParams)
      .then(() => this.replace(newFile, currentFile))
      .then(() => message.channel.send(localize.t('commands.modify.success', { modifier, sound })))
      .catch(() => message.channel.send(localize.t('commands.modify.error', { modifier, sound })));
  }

  // NOTE: We checked for param  already before so we can ignore any related errors
  private performModification(
    currentFile: string,
    newFile: string,
    modifier: string,
    params: string[]
  ) {
    switch (modifier) {
      case 'volume':
        // @ts-expect-error
        return this.modifyVolume(currentFile, newFile, ...params);
      case 'clip':
        // @ts-expect-error
        return this.clipSound(currentFile, newFile, ...params);
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

  private clipSound(currentFile: string, newFile: string, startTime: string, endTime: string) {
    const start = getSecondsFromTime(startTime)!;
    const end = getSecondsFromTime(endTime);

    let ffmpegCommand = ffmpeg(currentFile).output(newFile).setStartTime(start);
    if (end) ffmpegCommand = ffmpegCommand.setDuration(end - start);

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
