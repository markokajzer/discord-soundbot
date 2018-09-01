import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import Config from '@config/Config';

export default class ConfigCommand implements ICommand {
  public readonly TRIGGERS = ['config'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !config <option> <value>';
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public run(message: Message, params: Array<string>) {
    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const [field, ...value] = params;
    this.config.set(field, value);
  }
}
