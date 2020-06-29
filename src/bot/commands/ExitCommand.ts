import { Message, Permissions } from 'discord.js';

import * as exits from '@util/db/Exits';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class ExitCommand implements Command {
  public readonly TRIGGERS = ['exit'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !exit <sound> ?<user_id>';

  public run(message: Message, params: string[]) {
    if (params.length > this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    if (params.length === 1) {
      var [exitSound] = params;
      var user_id = message.author.id;
    } else {
      if (!message.member) return;
      if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

      var [exitSound, user_id] = params;
    }

    if (!exitSound) {
      exits.remove(user_id);
      return;
    }

    const sounds = getSounds();
    if (!sounds.includes(exitSound)) return;

    exits.add(user_id, exitSound);
  }
}
