import fs from 'fs';

import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import SoundUtil from '@util/SoundUtil';

export default class LastAddedCommand implements ICommand {
  public readonly TRIGGERS = ['lastadded'];
  private readonly AMOUNT = 5;

  private readonly soundUtil: SoundUtil;

  constructor(soundUtil: SoundUtil) {
    this.soundUtil = soundUtil;
  }

  public run(message: Message) {
    message.channel.send(['```', ...this.getLastAddedSounds(), '```'].join('\n'));
  }

  private getLastAddedSounds() {
    return this.soundUtil.getSoundsWithExtension()
      .map(sound => ({
        name: sound.name,
        creation: fs.statSync(this.soundUtil.getPathForSound(sound.name)).birthtime
      }))
      .sort((a, b) => b.creation.valueOf() - a.creation.valueOf())
      .slice(0, this.AMOUNT)
      .map(sound => sound.name);
  }
}
