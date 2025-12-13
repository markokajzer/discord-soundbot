import { ChannelType, Message } from "discord.js";

declare module "discord.js" {
  // NOTE: Monkeypatching
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
