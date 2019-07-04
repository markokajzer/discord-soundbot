import { Message } from 'discord.js';

import * as entrances from '@util/db/Entrances';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class EntranceCommand implements Command {
  public readonly TRIGGERS = ['entrance'];
  public readonly USAGE = 'Usage: !entrance <sound>';

  public run(message: Message, params: string[]) {
    const [entranceSound] = params;
    if (!entranceSound) {
      entrances.remove(message.author.id);
      return;
    }

    const sounds = getSounds();
    if (!sounds.includes(entranceSound)) return;

    entrances.add(message.author.id, entranceSound);
  }
}
