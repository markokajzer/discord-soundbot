import Config from '@config/Config';
import { GuildMember, Permissions } from 'discord.js';

const userHasElevatedRole = (member: GuildMember) => {
  const config = new Config();
  return member.roles.cache.some(
    r =>
      config.rolesAllowedToRunCommands.includes(r.name) &&
      member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)
  );
};

export default userHasElevatedRole;
