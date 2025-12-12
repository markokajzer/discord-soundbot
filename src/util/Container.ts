import Config from "~/config/Config";
import SoundQueue from "~/queue/SoundQueue";

import SoundBot from "../bot/SoundBot";

export const config = new Config();
const queue = new SoundQueue(config);

const soundBot = new SoundBot(config, queue);

interface SoundBotContainer {
  config: Config;
  soundBot: SoundBot;
}

export default {
  config,
  soundBot,
} as SoundBotContainer;
