import { DMChannel, GroupDMChannel, Message } from 'discord.js';

declare module 'discord.js' {
  interface Message {
    hasPrefix(prefix: string): boolean;
    isDirectMessage(): boolean;
  }
}

Message.prototype.hasPrefix = function (prefix: string) {
  return this.content.startsWith(prefix);
};

Message.prototype.isDirectMessage = function () {
  return (this.channel instanceof DMChannel) || (this.channel instanceof GroupDMChannel);
};
