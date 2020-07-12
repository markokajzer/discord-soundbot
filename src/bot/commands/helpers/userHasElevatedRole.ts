import { config } from '@util/Container';
import { GuildMember, Permissions } from 'discord.js';

const userHasElevatedRole = (member: GuildMember) =>
  member.roles.cache.some(
      member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)
    role =>
      config.elevatedRoles.includes(role.name) ||
  );

export default userHasElevatedRole;
