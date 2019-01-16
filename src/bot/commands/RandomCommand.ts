import { Message } from 'discord.js';

import Command from './base/Command';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import QueueItem from '@util/queue/QueueItem';
import SoundQueue from '@util/queue/SoundQueue';
import SoundUtil from '@util/SoundUtil';
import VoiceChannelFinder from './helpers/VoiceChannelFinder';

export default class RandomCommand implements Command {
  public readonly TRIGGERS = ['random'];
  public readonly NUMBER_OF_PARAMETERS = 1;

  private readonly db: DatabaseAdapter;
  private readonly soundUtil: SoundUtil;
  private readonly queue: SoundQueue;
  private readonly voiceChannelFinder: VoiceChannelFinder;

  constructor(soundUtil: SoundUtil, db: DatabaseAdapter, queue: SoundQueue, voiceChannelFinder: VoiceChannelFinder) {
    this.soundUtil = soundUtil;
    this.db = db;
    this.queue = queue;
    this.voiceChannelFinder = voiceChannelFinder;
  }

  public run(message: Message, params: string[]) {
    const voiceChannel = this.voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    let sounds!: string[];
    if (params.length === this.NUMBER_OF_PARAMETERS) {
      sounds = this.db.sounds.withTag(params[0]);
    } else {
      sounds = this.soundUtil.getSounds();
    }

    const random = sounds[Math.floor(Math.random() * sounds.length)];
    this.queue.add(new QueueItem(random, voiceChannel, message));
  }
}
