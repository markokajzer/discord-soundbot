import { Message } from 'discord.js';

declare module 'discord.js' {
  // NOTE: Monkeypatching
  // eslint-disable-next-line no-shadow
  interface Message {
    hasPrefix(prefix: string): boolean;
    isDirectMessage(): boolean;
    referencedMessage(): Promise<Message>;
    referencedAuthor(): Promise<User>;
  }
}

Message.prototype.hasPrefix = function hasPrefix(prefix) {
  return this.content.startsWith(prefix);
};

Message.prototype.isDirectMessage = function isDirectMessage() {
  return this.channel.type === 'dm';
};

Message.prototype.referencedMessage = function referencedMessage() {
  return this.channel.messages.fetch(this.reference!.messageID!);
};

Message.prototype.referencedAuthor = async function referencedAuthor() {
  const rMsg = await this.referencedMessage();
  return rMsg.author;
};
