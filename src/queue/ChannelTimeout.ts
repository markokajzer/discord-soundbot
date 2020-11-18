import { VoiceConnection } from 'discord.js';

import { config } from '~/util/Container';

export default class ChannelTimeout {
  private static timeout: Nullable<NodeJS.Timeout>;

  public static start(connection: VoiceConnection) {
    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(
      () => connection.disconnect(),
      config.timeout /* m */ * 60 /* s */ * 1000 // ms
    );
  }
}
