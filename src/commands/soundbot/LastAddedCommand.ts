import fs from 'fs';

import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundUtil from '../../util/SoundUtil';

export default class LastAddedCommand extends BaseCommand {
  public readonly TRIGGERS = ['lastadded'];

  public run(message: Message) {
    message.channel.send(['```', ...this.getLastAddedSounds(), '```'].join('\n'));
  }

  private getLastAddedSounds() {
    const soundsWithExtension = SoundUtil.getSoundsWithExtension();
    let lastAddedSounds = soundsWithExtension.map(sound => {
      return {
        name: sound.name,
        creation: fs.statSync(SoundUtil.getPathForSound(sound.name)).birthtime
      };
    });
    lastAddedSounds = lastAddedSounds.sort((a, b) =>
      new Date(b.creation).valueOf() - new Date(a.creation).valueOf());
    lastAddedSounds = lastAddedSounds.slice(0, 5);
    return lastAddedSounds.map(sound => sound.name);
  }
}
