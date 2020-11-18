import { GuildMember, Permissions } from 'discord.js';

import { config } from '~/util/Container';

const userHasElevatedRole = (member: Nullable<GuildMember>) => {
  if (!member) return false;
  if (member.hasPermission(Permissions.FLAGS.ADMINISTRATOR)) return true;

  return member.roles.cache.some(role => config.elevatedRoles.includes(role.name));
};

export default userHasElevatedRole;
