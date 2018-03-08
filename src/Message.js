const Discord = require('discord.js');

Discord.Message.prototype.hasPrefix = function hasPrefix(prefix) {
  return this.content.startsWith(prefix);
};

Discord.Message.prototype.isDirectMessage = function isDirectMessage() {
  return this.channel instanceof Discord.DMChannel;
};
