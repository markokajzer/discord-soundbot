import Config from '@config/Config';
import { Collection, Role } from 'discord.js';

const userHasElevatedRole = (rolesCache: Collection<string, Role>) => {
  const config = new Config();
  return rolesCache.some(r => config.rolesAllowedToRunCommands.includes(r.name));
};

export default userHasElevatedRole;
