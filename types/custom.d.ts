import type { Message as DiscordMessage, SendableChannels } from "discord.js";

import type Config from "~/config/Config";
import type { SoundQueue } from "~/queue/SoundQueue";

declare global {
  type Nullable<T> = T | undefined | null;
  type Dictionary<TValues> = Record<string, TValues>;

  type Message = DiscordMessage & {
    channel: SendableChannels;
  };
}

declare module "discord.js" {
  interface Client {
    config: Config;
    queue: SoundQueue;
    // @ts-expect-error Should be fine?
    user: ClientUser;
  }
}

declare module "@discordjs/voice" {
  // Custom events to handle commands
  interface AudioPlayer {
    on(event: "soundbot.idle", listener: () => void): this;
    on(event: "soundbot.next", listener: () => void): this;
    on(event: "soundbot.disconnected", listener: () => void): this;

    emit(event: "soundbot.idle"): boolean;
    emit(event: "soundbot.next"): boolean;
    emit(event: "soundbot.disconnected"): boolean;
  }
}
