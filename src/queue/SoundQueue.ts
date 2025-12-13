import {
  type AudioPlayer,
  type AudioPlayerState,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  type VoiceConnection,
  type VoiceConnectionState,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { DiscordAPIError } from "discord.js";

import type Config from "~/config/Config";
import * as sounds from "~/util/db/Sounds";
import localize from "~/util/i18n/localize";
import { getPathForSound } from "~/util/SoundUtil";
import ChannelTimeout from "./ChannelTimeout";
import QueueItem from "./QueueItem";

export default class SoundQueue {
  private readonly config: Config;

  private readonly player: AudioPlayer;
  private queue: QueueItem[] = [];
  private currentSound: Nullable<QueueItem>;
  private connection: Nullable<VoiceConnection>;

  constructor(config: Config) {
    this.config = config;
    this.player = createAudioPlayer();

    this.player.on("stateChange", this.signalIdle);
    // @ts-expect-error
    this.player.on("soundbot.idle", this.handleFinishedPlayingSound);
    // @ts-expect-error
    this.player.on("soundbot.next", this.handleFinishedPlayingSound);
    // @ts-expect-error
    this.player.on("soundbot.disconnected", this.handleFinishedPlayingSound);
  }

  public add(item: QueueItem) {
    this.queue.push(item);
    if (this.isStartable()) this.playNext();
  }

  public addBefore(item: QueueItem) {
    this.queue.unshift(item);

    if (this.isStartable()) this.playNext();
  }

  public next() {
    this.player.emit("soundbot.next");
  }

  public clear() {
    if (!this.currentSound) return;
    if (this.config.cleanup !== "none") this.deleteMessages();

    // Prevent further looping
    this.currentSound.count = 0;
    this.queue = [];
  }

  private isStartable() {
    return !this.currentSound;
  }

  private deleteMessages() {
    if (!this.currentSound) return;
    if (this.isEmpty()) return;

    const { message: currentMessage } = this.currentSound;
    const messagesToDelete = this.queue
      .map((item) => item.message)
      .filter((message) => !!message)
      .filter((message) => message.id !== currentMessage?.id);

    // Do not try to delete the same sound multiple times (!combo)
    Array.from(new Set(messagesToDelete))
      .filter((message) => !this.wasMessageAlreadyDeleted(message))
      .forEach((message) => message.delete());
  }

  private async playNext() {
    this.currentSound = this.queue.shift();
    if (!this.currentSound) throw Error("Queue was empty");

    try {
      this.connection = joinVoiceChannel({
        adapterCreator: this.currentSound.channel.guild.voiceAdapterCreator,
        channelId: this.currentSound.channel.id,
        guildId: this.currentSound.channel.guild.id,
      });

      this.playSound();
    } catch (error) {
      this.handleError(error);
    }
  }

  private playSound() {
    if (!this.currentSound) throw Error("No currentSound in context");
    if (!this.connection) throw Error("No connection in context");

    const sound = getPathForSound(this.currentSound.name);
    const resource = createAudioResource(sound);

    this.connection.subscribe(this.player);
    // Handle commands where the bot leaves the channel, e.g. !stop, !leave
    this.connection.on("stateChange", this.signalDisconnected);

    this.player.play(resource);
  }

  private signalIdle = (oldState: AudioPlayerState, newState: AudioPlayerState) => {
    if (this.becameIdleAfterPlaying(oldState, newState)) {
      this.player.emit("soundbot.idle");
    }
  };

  private signalDisconnected = (
    _oldState: VoiceConnectionState,
    newState: VoiceConnectionState
  ) => {
    if (newState.status === VoiceConnectionStatus.Disconnected) {
      this.player.emit("soundbot.disconnected");
    }
  };

  private handleFinishedPlayingSound = () => {
    if (!this.currentSound) throw Error("No currentSound in context");
    if (!this.connection) throw Error("No connection in context");

    const { name, channel, message, count } = this.currentSound;
    sounds.incrementCount(name);

    if (count > 1) {
      this.add(new QueueItem(name, channel, message, count - 1));
    } else {
      this.deleteCurrentMessage();
    }

    this.currentSound = null;

    if (!this.isEmpty()) {
      this.playNext();
      return;
    }

    if (!this.config.stayInChannel) {
      this.connection.destroy();
      return;
    }

    if (this.config.timeout > 0) ChannelTimeout.start(this.connection);
  };

  private async handleError(error: unknown) {
    if (
      error instanceof DiscordAPIError &&
      error.code === "VOICE_JOIN_CHANNEL" &&
      this.currentSound?.message
    ) {
      await this.currentSound.message.channel.send(localize.t("errors.permissions"));
      process.exit();
    }

    console.error("Error occured!", "\n", error);

    this.currentSound = null;
  }

  private deleteCurrentMessage() {
    if (this.config.cleanup === "none") return;
    if (!this.currentSound || !this.currentSound.message) return;
    if (!this.isLastSoundFromCurrentMessage(this.currentSound.message)) return;
    if (this.wasMessageAlreadyDeleted(this.currentSound.message)) return;

    this.currentSound.message.delete();
  }

  private isEmpty() {
    return this.queue.length === 0;
  }

  private wasMessageAlreadyDeleted(message: Message) {
    if (!message) return false;

    return !message.channel.messages.cache.has(message.id);
  }

  private isLastSoundFromCurrentMessage(message: Message) {
    return !this.queue.some((item) => !!item.message && item.message.id === message.id);
  }

  private becameIdleAfterPlaying(oldState: AudioPlayerState, newState: AudioPlayerState) {
    return (
      oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle
    );
  }
}
