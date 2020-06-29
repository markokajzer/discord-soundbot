import { Message, Permissions } from 'discord.js';

import * as entrances from '@util/db/Entrances';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class EntranceCommand implements Command {
  public readonly TRIGGERS = ['entrance'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !entrance <sound> ?<user_id>';

  public run(message: Message, params: string[]) {
    if (params.length > this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    if (params.length === 1) {
      var [entranceSound] = params;
      var user_id = message.author.id;
    }else{
      if (!message.member) return;
      if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;
      
      var [entranceSound, user_id] = params;
    }

    if (!entranceSound) {
      entrances.remove(user_id);
      return;
    }

    const sounds = getSounds();
    if (!sounds.includes(entranceSound)) return;

    entrances.add(user_id, entranceSound);
  }
}