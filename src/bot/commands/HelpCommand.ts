import { Message } from 'discord.js';

import Config from '@config/Config';
import localize from '@util/i18n/localize';
import Command from './base/Command';
import chunkedMessages from './helpers/chunkedMessages';

export default class HelpCommand implements Command {
  public readonly TRIGGERS = ['commands', 'help'];
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public run(message: Message) {
    chunkedMessages(this.getFormattedListOfCommands())
      .forEach(chunk => message.author.send(chunk));
  }

  private getFormattedListOfCommands() {
    return [
      localize.t('help.headline', { prefix: this.config.prefix }),
      '',
      `welcome                          ${localize.t('help.welcome')}`,
      `commands                         ${localize.t('help.commands')}`,
      `help                             ${localize.t('help.commands')}`,

      `sounds                           ${localize.t('help.sounds.all')}`,
      `add                              ${localize.t('help.sounds.add')}`,
      `add <name> <link>                ${localize.t('help.sounds.add')}`,
      `add <name> <link> <start>        ${localize.t('help.sounds.add')}`,
      `add <name> <link> <start> <end>  ${localize.t('help.sounds.add')}`,
      `<sound>                          ${localize.t('help.sounds.play')}`,
      `combo <sound> <sound> ...        ${localize.t('help.sounds.combo')}`,
      `random                           ${localize.t('help.sounds.random')}`,
      `random <tag>                     ${localize.t('help.sounds.random')}`,
      `loop <sound> <count?>            ${localize.t('help.sounds.loop')}`,
      `repeat <sound> <count?>          ${localize.t('help.sounds.loop')}`,
      `rename <old> <new>               ${localize.t('help.sounds.rename')}`,
      `remove <sound>                   ${localize.t('help.sounds.remove')}`,
      `download <sound>                 ${localize.t('help.sounds.download')}`,
      `stop                             ${localize.t('help.sounds.stop')}`,
      `leave                            ${localize.t('help.sounds.stop')}`,

      `entrance <sound>                 ${localize.t('help.entrance.set')}`,
      `entrance                         ${localize.t('help.entrance.remove')}`,

      `tag <sound> <tag>                ${localize.t('help.tags.add')}`,
      `tag <sound>                      ${localize.t('help.tags.list')}`,
      `tag <sound> clear                ${localize.t('help.tags.clear')}`,
      `tags                             ${localize.t('help.tags.all')}`,
      `search <tag>                     ${localize.t('help.tags.search')}`,

      `mostplayed                       ${localize.t('help.mostplayed')}`,
      `lastadded                        ${localize.t('help.lastadded')}`,

      `ignore <user>                    ${localize.t('help.ignore')}`,
      `unignore <user>                  ${localize.t('help.unignore')}`,
      `avatar                           ${localize.t('help.avatar')}`,
      `avatar remove                    ${localize.t('help.avatar')}`,
      `config <option> <value>          ${localize.t('help.config')}`,
      `set <option> <value>             ${localize.t('help.config')}`
    ];
  }
}
