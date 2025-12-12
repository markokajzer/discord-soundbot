import { ChannelType, Message } from "discord.js";

import type Config from "~/config/Config";
import type SoundQueue from "~/queue/SoundQueue";

declare module "discord.js" {
  interface Client {
    config: Config;
    queue: SoundQueue;
    // @ts-expect-error Should be fine?
    user: ClientUser;
  }

  // NOTE: Monkeypatching
  // eslint-disable-next-line no-shadow
  interface Message {
    hasPrefix(prefix: string): boolean;
    isDirectMessage(): boolean;
  }
}

Message.prototype.hasPrefix = function hasPrefix(prefix) {
  return this.content.startsWith(prefix);
};

Message.prototype.isDirectMessage = function isDirectMessage() {
  return this.channel.type === ChannelType.DM;
};
