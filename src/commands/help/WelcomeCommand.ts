import { Message } from 'discord.js';

import localize from '~/util/i18n/localize';

import ConfigCommand from '../base/ConfigCommand';

export class WelcomeCommand extends ConfigCommand {
  public readonly triggers = ['welcome'];

  public async run(message: Message) {
    await message.edit(localize.t('welcome', { prefix: this.config.prefix }));
  }
}
