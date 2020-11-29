import { Message } from 'discord.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import util from 'util';

import { FormatError } from '~/util/Errors';
import getSecondsFromTime from '~/util/getSecondsFromTime';
import localize from '~/util/i18n/localize';
import { existsSound, getExtensionForSound } from '~/util/SoundUtil';

import Command from '../base/Command';
import ErrorParams from './modify/ErrorParams';
import FileInfo from './modify/FileInfo';
import MODIFIER_OPTIONS from './modify/ModifierOptions';

const rename = util.promisify(fs.rename);

export class ModifyCommand extends Command {
  public readonly triggers = ['modify', 'change'];

  public async run(message: Message, params: string[]) {
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

    const fileInfo = this.getFileNameFor(sound);

    try {
      await this.performModification(fileInfo, modifier, commandParams);
      await this.replace(fileInfo);
      message.channel.send(localize.t('commands.modify.success', { modifier, sound }));
    } catch (error) {
      this.handleError(message, error, { modifier, sound });
    }
  }

  // NOTE: We checked for param already before so we can ignore any related errors
  private async performModification(
    file: FileInfo,
    modifier: string,
    params: string[]
  ): Promise<void> {
    switch (modifier) {
      case 'clip':
        return this.clipSound(file, ...params);
      case 'volume':
        return this.modifyVolume(file, ...params);
      default:
        return Promise.reject();
    }
  }

  private modifyVolume({ currentFile, tempFile }: FileInfo, ...params: string[]): Promise<void> {
    const [value] = params;
    const ffmpegCommand = ffmpeg(currentFile)
      .audioFilters([{ filter: 'volume', options: value }])
      .output(tempFile);

    return new Promise((resolve, reject) =>
      ffmpegCommand.on('end', resolve).on('error', reject).run()
    );
  }

  private clipSound({ currentFile, tempFile }: FileInfo, ...params: string[]): Promise<void> {
    const [startTime, endTime] = params;

    // NOTE: We checked params already, so start is definitely here
    const start = getSecondsFromTime(startTime)!;
    const end = getSecondsFromTime(endTime);

    let ffmpegCommand = ffmpeg(currentFile).output(tempFile).setStartTime(start);
    if (end) ffmpegCommand = ffmpegCommand.setDuration(end - start);

    return new Promise((resolve, reject) =>
      ffmpegCommand.on('end', resolve).on('error', reject).run()
    );
  }

  private replace({ currentFile, tempFile }: FileInfo): Promise<void> {
    return rename(tempFile, currentFile);
  }

  private getFileNameFor(sound: string): FileInfo {
    const extension = getExtensionForSound(sound);
    const currentFile = `./sounds/${sound}.${extension}`;

    const timestamp = Date.now();
    const tempFile = `./sounds/${sound}-${timestamp}.${extension}`;

    return { currentFile, tempFile };
  }

  private handleError(message: Message, error: Error, { modifier, sound }: ErrorParams) {
    if (error instanceof FormatError) {
      message.channel.send(error.message);
      return;
    }

    message.channel.send(localize.t('commands.modify.error', { modifier, sound }));
  }
}
