import Config from '@config/Config';
import SoundQueue from '@queue/SoundQueue';
import CommandCollection from '../bot/CommandCollection';
import MessageHandler from '../bot/MessageHandler';
import SoundBot from '../bot/SoundBot';

import YoutubeDownloader from '../bot/commands/helpers/downloader/YoutubeDownloader';
import YoutubeValidator from '../bot/commands/helpers/downloader/validator/YoutubeValidator';
import AttachmentDownloader from '../bot/commands/helpers/downloader/AttachmentDownloader';
import AttachmentValidator from '../bot/commands/helpers/downloader/validator/AttachmentValidator';

import AddCommand from '../bot/commands/AddCommand';
import AvatarCommand from '../bot/commands/AvatarCommand';
import ComboCommand from '../bot/commands/ComboCommand';
import ConfigCommand from '../bot/commands/ConfigCommand';
import DownloadCommand from '../bot/commands/DownloadCommand';
import EntranceCommand from '../bot/commands/EntranceCommand';
import ExitCommand from '../bot/commands/ExitCommand';
import HelpCommand from '../bot/commands/HelpCommand';
import IgnoreCommand from '../bot/commands/IgnoreCommand';
import LastAddedCommand from '../bot/commands/LastAddedCommand';
import LoopCommand from '../bot/commands/LoopCommand';
import MostPlayedCommand from '../bot/commands/MostPlayedCommand';
import NextCommand from '../bot/commands/NextCommand';
import PingCommand from '../bot/commands/PingCommand';
import RandomCommand from '../bot/commands/RandomCommand';
import RemoveCommand from '../bot/commands/RemoveCommand';
import RenameCommand from '../bot/commands/RenameCommand';
import SearchCommand from '../bot/commands/SearchCommand';
import SkipCommand from '../bot/commands/SkipCommand';
import SoundCommand from '../bot/commands/SoundCommand';
import SoundsCommand from '../bot/commands/SoundsCommand';
import StopCommand from '../bot/commands/StopCommand';
import TagCommand from '../bot/commands/TagCommand';
import TagsCommand from '../bot/commands/TagsCommand';
import UnignoreCommand from '../bot/commands/UnignoreCommand';
import WelcomeCommand from '../bot/commands/WelcomeCommand';

export const config = new Config();
const queue = new SoundQueue(config);

const attachmentValidator = new AttachmentValidator(config);
const attachmentDownloader = new AttachmentDownloader(attachmentValidator);

const youtubeValidator = new YoutubeValidator();
const youtubeDownloader = new YoutubeDownloader(youtubeValidator);

const commands = [
  new PingCommand(),

  // SOUND PLAYING RELATED COMMANDS
  new SoundCommand(queue),
  new ComboCommand(queue),
  new RandomCommand(queue),
  new LoopCommand(queue),
  new NextCommand(queue),
  new SkipCommand(queue),
  new StopCommand(queue),

  // ENTRANCE / EXIT SOUNDS
  new EntranceCommand(),
  new ExitCommand(),

  // SOUND ADMINISTRATION COMMANDS
  new AddCommand(attachmentDownloader, youtubeDownloader),
  new SoundsCommand(config),
  new SearchCommand(),
  new RenameCommand(),
  new RemoveCommand(),
  new TagCommand(),
  new TagsCommand(),
  new DownloadCommand(),

  // HELP / INFO COMMANDS
  new WelcomeCommand(config),
  new HelpCommand(config),
  new LastAddedCommand(),
  new MostPlayedCommand(),

  // CONFIGURATION RELATED COMMANDS
  new AvatarCommand(config),
  new ConfigCommand(config),
  new IgnoreCommand(),
  new UnignoreCommand()
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
  soundBot
} as SoundBotContainer;
