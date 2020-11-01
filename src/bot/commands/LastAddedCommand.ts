import { Message } from 'discord.js';
import fs from 'fs';

import { getPathForSound, getSoundsWithExtension } from '~/util/SoundUtil';

import Command from './base/Command';

export default class LastAddedCommand implements Command {
  public readonly TRIGGERS = ['lastadded'];
  private readonly AMOUNT = 5;

  public run(message: Message) {
    message.channel.send(['```', ...this.getLastAddedSounds(), '```'].join('\n'));
  }

  private getLastAddedSounds() {
    return getSoundsWithExtension()
      .map(sound => ({
        name: sound.name,
        creation: fs.statSync(getPathForSound(sound.name)).birthtime
      }))
      .sort((a, b) => b.creation.valueOf() - a.creation.valueOf())
      .slice(0, this.AMOUNT)
      .map(sound => sound.name);
  }
}
