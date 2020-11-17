import { Message } from 'discord.js';
import fs from 'fs';

import * as sounds from '~/util/db/Sounds';
import localize from '~/util/i18n/localize';
import { existsSound, getPathForSound } from '~/util/SoundUtil';

import Command from '../base/Command';
import userHasElevatedRole from '../util/userHasElevatedRole';

export class RemoveCommand extends Command {
  public readonly triggers = ['remove'];
  public readonly numberOfParameters = 1;
  public readonly usage = 'Usage: !remove <sound>';

  public run(message: Message, params: string[]) {
    if (!message.member) return;

    const allowedToRunCommand = userHasElevatedRole(message.member);
    if (!allowedToRunCommand) {
      message.channel.send(localize.t('errors.unauthorized'));
      return;
    }

    if (params.length !== this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    const sound = params.shift()!;
    if (!existsSound(sound)) {
      message.channel.send(localize.t('commands.remove.notFound', { sound }));
      return;
    }

    const file = getPathForSound(sound);
    fs.unlinkSync(file);
    sounds.remove(sound);

    message.channel.send(localize.t('commands.remove.success', { sound }));
  }
}
