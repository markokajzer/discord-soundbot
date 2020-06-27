import { Message, Permissions } from 'discord.js';

import * as sounds from '@util/db/Sounds';
import localize from '@util/i18n/localize';
import { getSounds } from '@util/SoundUtil';
import Config from '@config/Config';
import Command from './base/Command';
import userHasElevatedRole from './helpers/checkElevatedRights';

export default class TagCommand implements Command {
  public readonly TRIGGERS = ['tag'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !tag <sound> [<tag> ... <tagN> | clear]';

  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

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

      const allowedToRunCommand = userHasElevatedRole(message.member.roles.cache);
      if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!) && !allowedToRunCommand) {
        return;
      }

      sounds.clearTags(sound);
      return;
    }

    sounds.addTags(sound, params);
  }
}
