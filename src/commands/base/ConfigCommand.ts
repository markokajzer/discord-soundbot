import Config from '~/config/Config';

import Command from './Command';

export default abstract class ConfigCommand extends Command {
  protected readonly config: Config;

  constructor(config: Config) {
    super();
    this.config = config;
  }
}
