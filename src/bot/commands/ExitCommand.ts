import { Message, Permissions } from 'discord.js';

import * as exits from '@util/db/Exits';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class ExitCommand implements Command {
  public readonly TRIGGERS = ['exit'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !exit <sound> ?<userId>';

  public run(message: Message, params: string[]) {
    let exitSound;
    let userId;
    if (params.length > this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    if (params.length === 1) {
      [exitSound] = params;
      userId = message.author.id;
    } else {
      if (!message.member) return;
      if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

      [exitSound, userId] = params;
    }

    if (!exitSound) {
      exits.remove(userId);
      return;
    }

    const sounds = getSounds();
    if (!sounds.includes(exitSound)) return;

    exits.add(userId, exitSound);
  }
}
