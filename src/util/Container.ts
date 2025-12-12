import Config from "~/config/Config";
import SoundQueue from "~/queue/SoundQueue";

import MessageHandler from "../bot/MessageHandler";
import SoundBot from "../bot/SoundBot";

export const config = new Config();
const queue = new SoundQueue(config);

const messageHandler = new MessageHandler();

const soundBot = new SoundBot(config, messageHandler, queue);

interface SoundBotContainer {
  config: Config;
  soundBot: SoundBot;
}

export default {
  config,
  soundBot,
} as SoundBotContainer;
