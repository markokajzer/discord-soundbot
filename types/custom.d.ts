import type { Message as DiscordMessage, SendableChannels } from "discord.js";

declare global {
  type Nullable<T> = T | undefined | null;
  type Dictionary<TValues> = Record<string, TValues>;

  type Message = DiscordMessage & {
    channel: SendableChannels;
  };
}
