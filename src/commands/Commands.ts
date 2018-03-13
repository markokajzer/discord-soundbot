import { AddCommand as Add } from './soundbot/AddCommand';
import { RenameCommand as Rename } from './soundbot/RenameCommand';
import { RemoveCommand as Remove } from './soundbot/RemoveCommand';

import { RandomCommand as Random } from './soundbot/RandomCommand';
import { SoundCommand as Sound } from './soundbot/SoundCommand';

import { SoundsCommand as Sounds } from './soundbot/SoundsCommand';
import { HelpCommand as Help } from './soundbot/HelpCommand';
import { LastAddedCommand as LastAdded } from './soundbot/LastAddedCommand';
import { MostPlayedCommand as MostPlayed } from './soundbot/MostPlayedCommand';

import { IgnoreCommand as Ignore } from './soundbot/IgnoreCommand';
import { UnignoreCommand as Unignore } from './soundbot/UnignoreCommand';

import { StopCommand as Stop } from './soundbot/StopCommand';

export {
  Add, Rename, Remove,
  Sound, Random,
  Sounds, Help, LastAdded, MostPlayed,
  Ignore, Unignore,
  Stop
};
