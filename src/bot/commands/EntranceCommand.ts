import { Message, Permissions } from 'discord.js';

import * as entrances from '@util/db/Entrances';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class EntranceCommand implements Command {
  public readonly TRIGGERS = ['entrance'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !entrance <sound> ?<userId>';

  public run(message: Message, params: string[]) {
    let entranceSound;
    let userId;
    if (params.length > this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    if (params.length === 1) {
      [entranceSound] = params;
      userId = message.author.id;
    } else {
      if (!message.member) return;
      if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

      [entranceSound, userId] = params;
    }

    if (!entranceSound) {
      entrances.remove(userId);
      return;
    }

    const sounds = getSounds();
    if (!sounds.includes(entranceSound)) return;

    entrances.add(userId, entranceSound);
  }
}
