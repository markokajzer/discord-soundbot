import { Message } from 'discord.js';
import fs from 'fs';

import { getPathForSound, getSoundsWithExtension } from '~/util/SoundUtil';

import Command from '../base/Command';

export class LastAddedCommand extends Command {
  public readonly triggers = ['lastadded'];
  private readonly amount = 5;

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
      .slice(0, this.amount)
      .map(sound => sound.name);
  }
}
