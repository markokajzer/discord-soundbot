import { config } from '@util/Container';
import { GuildMember, Permissions } from 'discord.js';

const userHasElevatedRole = (member: GuildMember) =>
  member.roles.cache.some(
    role =>
      config.elevatedRoles.includes(role.name) ||
      member.hasPermission(Permissions.FLAGS.ADMINISTRATOR)
  );

export default userHasElevatedRole;
