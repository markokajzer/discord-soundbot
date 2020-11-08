import { GuildMember, Permissions } from 'discord.js';

import { config } from '~/util/Container';

const userHasElevatedRole = (member: GuildMember) =>
  member.roles.cache.some(
    role =>
      config.elevatedRoles.includes(role.name) ||
      member.hasPermission(Permissions.FLAGS.ADMINISTRATOR)
  );

export default userHasElevatedRole;
