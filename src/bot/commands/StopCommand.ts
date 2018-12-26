import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import SoundUtil from '@util/SoundUtil';
import SoundQueue from '@util/queue/SoundQueue';

export default class StopCommand implements ICommand {
  public readonly TRIGGERS = ['leave', 'stop'];

  private readonly soundUtil: SoundUtil;
  private readonly queue: SoundQueue;

  constructor(soundUtil: SoundUtil, queue: SoundQueue) {
    this.soundUtil = soundUtil;
    this.queue = queue;
  }

  public run(message: Message) {
    this.soundUtil.randomLoop = false;
    this.queue.clear();
    const voiceConnection = message.guild.voiceConnection;
    if (voiceConnection) voiceConnection.disconnect();
  }
}
