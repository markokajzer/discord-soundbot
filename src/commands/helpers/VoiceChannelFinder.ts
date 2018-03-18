import { Message } from 'discord.js';

export default class VoiceChannelFinder {
  public getVoiceChannelFromMessageAuthor(message: Message) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      message.reply('Join a voice channel first!');
    }

    return voiceChannel;
  }
}
