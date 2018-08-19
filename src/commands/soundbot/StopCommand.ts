import { Message } from 'discord.js';

import ICommand from '../base/ICommand';

import SoundQueue from '../../queue/SoundQueue';

export default class StopCommand implements ICommand {
  public readonly TRIGGERS = ['leave', 'stop'];
  private readonly queue: SoundQueue;

  constructor(queue: SoundQueue) {
    this.queue = queue;
  }

  public run(message: Message) {
    this.queue.items().forEach(item => item.message.delete());
    this.queue.clear();
    const voiceConnection = message.guild.voiceConnection;
    if (voiceConnection) voiceConnection.disconnect();
  }
}
