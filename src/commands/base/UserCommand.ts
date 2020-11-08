import { ClientUser } from 'discord.js';

import Command from './Command';

export default interface UserCommand extends Command {
  setClientUser(user: ClientUser): void;
}
