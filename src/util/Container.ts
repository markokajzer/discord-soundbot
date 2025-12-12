import Config from "~/config/Config";
import SoundQueue from "~/queue/SoundQueue";

import CommandCollection from "../bot/CommandCollection";
import MessageHandler from "../bot/MessageHandler";
import SoundBot from "../bot/SoundBot";
import {
  AvatarCommand,
  ConfigCommand,
  IgnoreCommand,
  LanguageCommand,
  UnignoreCommand,
} from "../commands/config";
import {
  HelpCommand,
  LastAddedCommand,
  MostPlayedCommand,
  PingCommand,
  WelcomeCommand,
} from "../commands/help";
import {
  AddCommand,
  DownloadCommand,
  EntranceCommand,
  ExitCommand,
  ModifyCommand,
  RemoveCommand,
  RenameCommand,
  SearchCommand,
  SoundsCommand,
  StopCommand,
  TagCommand,
  TagsCommand,
} from "../commands/manage";
import {
  ComboCommand,
  LoopCommand,
  NextCommand,
  RandomCommand,
  SkipCommand,
  SoundCommand,
} from "../commands/sound";

export const config = new Config();
const queue = new SoundQueue(config);

const commands = [
  new PingCommand(),

  // SOUND PLAYING RELATED COMMANDS
  new SoundCommand(),
  new ComboCommand(),
  new RandomCommand(),
  new LoopCommand(),
  new NextCommand(),
  new SkipCommand(),
  new StopCommand(),

  // ENTRANCE / EXIT SOUNDS
  new EntranceCommand(),
  new ExitCommand(),

  // SOUND ADMINISTRATION COMMANDS
  new AddCommand(),
  new SoundsCommand(),
  new SearchCommand(),
  new ModifyCommand(),
  new RenameCommand(),
  new RemoveCommand(),
  new TagCommand(),
  new TagsCommand(),
  new DownloadCommand(),

  // HELP / INFO COMMANDS
  new WelcomeCommand(),
  new HelpCommand(),
  new LastAddedCommand(),
  new MostPlayedCommand(),

  // CONFIGURATION RELATED COMMANDS
  new AvatarCommand(),
  new ConfigCommand(),
  new LanguageCommand(),
  new IgnoreCommand(),
  new UnignoreCommand(),
];

const commandCollection = new CommandCollection(commands);
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
