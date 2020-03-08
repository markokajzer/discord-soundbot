import { VoiceConnection } from 'discord.js';

import { config } from '@util/Container';

export default class ChannelTimeout {
  private static timeout: NodeJS.Timeout | undefined = undefined;

  public static start(connection: VoiceConnection) {
    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(
      () => connection.disconnect(),
      config.timeout /* m */ * 60 /* s */ * 1000 // ms
    );
  }
}
