import { Message } from 'discord.js';

export default class UserFinder {
  public getUsersFromMentions(message: Message, usage: string) {
    const users = message.mentions.users;
    if (users.size < 1) {
      message.channel.send(usage);
      message.channel.send('User not found on this server.');
    }

    return users;
  }
}
