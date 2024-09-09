import type { VoiceConnection } from "@discordjs/voice";

import { config } from "~/util/Container";

// biome-ignore lint/complexity/noStaticOnlyClass: I need shared/global object so its either this or a singleton
export default class ChannelTimeout {
  private static timeout: Nullable<NodeJS.Timeout>;

  public static start(connection: VoiceConnection) {
    if (ChannelTimeout.timeout) clearTimeout(ChannelTimeout.timeout);

    ChannelTimeout.timeout = setTimeout(
      () => connection.disconnect(),
      config.timeout /* m */ * 60 /* s */ * 1000 // ms
    );
  }
}
