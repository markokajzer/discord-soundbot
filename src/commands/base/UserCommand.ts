import { ClientUser } from 'discord.js';

export default interface UserCommand {
  setClientUser(user: ClientUser): void;
}
