import { Message } from 'discord.js';

import Command from './base/Command';

import Config from '@config/Config';
import LocaleService from '@util/i18n/LocaleService';

export default class HelpCommand implements Command {
  public readonly TRIGGERS = ['commands', 'help'];
  private readonly config: Config;
  private readonly localeService: LocaleService;

  constructor(config: Config, localeService: LocaleService) {
    this.config = config;
    this.localeService = localeService;
  }

  public run(message: Message) {
    message.author.send(this.getFormattedListOfCommands());
  }

  private getFormattedListOfCommands() {
    return [
      '```',
      this.localeService.t('help.headline', { prefix: this.config.prefix }),
      '',
      `welcome                          ${this.localeService.t('help.welcome')}`,
      `commands                         ${this.localeService.t('help.commands')}`,
      `sounds                           ${this.localeService.t('help.sounds')}`,
      `add                              ${this.localeService.t('help.add')}`,
      `add <name> <link>                ${this.localeService.t('help.add')}`,
      `add <name> <link> <start>        ${this.localeService.t('help.add')}`,
      `add <name> <link> <start> <end>  ${this.localeService.t('help.add')}`,
      `<sound>                          ${this.localeService.t('help.play')}`,
      'entrance <sound>                 Play the specified sound when you join a channel',
      `combo <sound> ...                ${this.localeService.t('help.combo')}`,
      `random                           ${this.localeService.t('help.random')}`,
      `random <tag>                     ${this.localeService.t('help.random')}`,
      `rename <old> <new>               ${this.localeService.t('help.rename')}`,
      `remove <sound>                   ${this.localeService.t('help.remove')}`,
      `download <sound>                 ${this.localeService.t('help.download')}`,
      `stop                             ${this.localeService.t('help.stop')}`,
      `leave                            ${this.localeService.t('help.leave')}`,
      `tag <sound> <tag>                ${this.localeService.t('help.tag.add')}`,
      `tag <sound>                      ${this.localeService.t('help.tag.list')}`,
      `tag <sound> clear                ${this.localeService.t('help.tag.clear')}`,
      `tags                             ${this.localeService.t('help.tags')}`,
      `search <tag>                     ${this.localeService.t('help.search')}`,
      `mostplayed                       ${this.localeService.t('help.mostplayed')}`,
      `lastadded                        ${this.localeService.t('help.lastadded')}`,
      `ignore <user>                    ${this.localeService.t('help.ignore')}`,
      `unignore <user>                  ${this.localeService.t('help.unignore')}`,
      `avatar                           ${this.localeService.t('help.avatar')}`,
      `avatar remove                    ${this.localeService.t('help.avatar')}`,
      `config <option> <value>          ${this.localeService.t('help.config')}`,
      '```'
    ].join('\n');
  }
}
