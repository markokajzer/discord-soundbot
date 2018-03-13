import { AddCommand as Add } from './soundbot/AddCommand';
import { RenameCommand as Rename } from './soundbot/RenameCommand';
import { RemoveCommand as Remove } from './soundbot/RemoveCommand';

import { CommandListCommand as CommandList } from './soundbot/CommandListCommand';
import { LastAddedCommand as LastAdded } from './soundbot/LastAddedCommand';
import { MostPlayedCommand as MostPlayed } from './soundbot/MostPlayedCommand';

import { IgnoreCommand as Ignore } from './soundbot/IgnoreCommand';
import { UnignoreCommand as Unignore } from './soundbot/UnignoreCommand';

import { StopCommand as Stop } from './soundbot/StopCommand';

export {
  Add, Rename, Remove,
  CommandList, LastAdded, MostPlayed,
  Ignore, Unignore,
  Stop
};
