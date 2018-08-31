import { Message } from 'discord.js';

import config from '../../../config/config.json';

import ICommand from './base/ICommand';

import LocaleService from '../../util/i18n/LocaleService';

export default class HelpCommand implements ICommand {
  public readonly TRIGGERS = ['commands', 'help'];
  private readonly localeService: LocaleService;

  constructor(localeService: LocaleService) {
    this.localeService = localeService;
  }

  public run(message: Message) {
    message.author.send(this.getFormattedListOfCommands());
  }

  private getFormattedListOfCommands() {
    return [
      '```',
      this.localeService.t('help.headline', { prefix: config.prefix }),
      '',
      `welcome              ${this.localeService.t('help.welcome')}`,
      `commands             ${this.localeService.t('help.commands')}`,
      `sounds               ${this.localeService.t('help.sounds')}`,
      `add                  ${this.localeService.t('help.add')}`,
      `add <name> <link>    ${this.localeService.t('help.add')}`,
      `<sound>              ${this.localeService.t('help.play')}`,
      `random               ${this.localeService.t('help.random')}`,
      `rename <old> <new>   ${this.localeService.t('help.rename')}`,
      `remove <sound>       ${this.localeService.t('help.remove')}`,
      `download <sound>     ${this.localeService.t('help.download')}`,
      `stop                 ${this.localeService.t('help.stop')}`,
      `leave                ${this.localeService.t('help.leave')}`,
      `tag <sound> <tag>    ${this.localeService.t('help.tag.add')}`,
      `tag <sound>          ${this.localeService.t('help.tag.list')}`,
      `tag <sound> clear    ${this.localeService.t('help.tag.clear')}`,
      `tags                 ${this.localeService.t('help.tags')}`,
      `search <tag>         ${this.localeService.t('help.search')}`,
      `mostplayed           ${this.localeService.t('help.mostplayed')}`,
      `lastadded            ${this.localeService.t('help.lastadded')}`,
      `ignore <user>        ${this.localeService.t('help.ignore')}`,
      `unignore <user>      ${this.localeService.t('help.unignore')}`,
      `avatar [remove]      ${this.localeService.t('help.avatar')}`,
      '```'
    ].join('\n');
  }
}
