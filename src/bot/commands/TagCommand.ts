import { Message, Permissions } from 'discord.js';

import * as sounds from '@util/db/Sounds';
import localize from '@util/i18n/localize';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class TagCommand implements Command {
  public readonly TRIGGERS = ['tag'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !tag <sound> [<tag> ... <tagN> | clear]';

  public run(message: Message, params: string[]) {
    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = params.shift()!;
    if (!getSounds().includes(sound)) {
      message.channel.send(localize.t('commands.tag.notFound', { sound }));
      return;
    }

    if (!params.length) {
      const tags = sounds.listTags(sound).join(', ');
      message.author.send(localize.t('commands.tag.found', { sound, tags }));
      return;
    }

    if (params[0] === 'clear') {
      if (!message.member) return;
      if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

      sounds.clearTags(sound);
      return;
    }

    sounds.addTags(sound, params);
  }
}
