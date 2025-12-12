import Config from "~/config/Config";
import SoundQueue from "~/queue/SoundQueue";

import CommandCollection from "../bot/CommandCollection";
import MessageHandler from "../bot/MessageHandler";
import SoundBot from "../bot/SoundBot";

export const config = new Config();
const queue = new SoundQueue(config);

const commandCollection = new CommandCollection();
const messageHandler = new MessageHandler(commandCollection);

const soundBot = new SoundBot(config, commandCollection, messageHandler, queue);

interface SoundBotContainer {
  config: Config;
  soundBot: SoundBot;
}

export default {
  config,
  soundBot,
} as SoundBotContainer;
