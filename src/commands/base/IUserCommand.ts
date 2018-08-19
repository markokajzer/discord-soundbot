import { ClientUser } from 'discord.js';

import ICommand from './ICommand';

export default interface IUserCommand extends ICommand {
  setClientUser(user: ClientUser): void;
}
