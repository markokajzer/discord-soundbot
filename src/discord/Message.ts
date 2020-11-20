import { Message } from 'discord.js';

declare module 'discord.js' {
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
  return this.channel.type === 'dm';
};
