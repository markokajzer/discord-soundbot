import { Collection, GuildMember, GuildMemberRoleManager, Permissions, Role } from 'discord.js';

import { config } from '~/util/Container';

import userHasElevatedRole from '../userHasElevatedRole';

jest.mock('~/util/Container');

describe('userHasElevatedRoles', () => {
  it('returns false when member is undefined', () => {
    expect(userHasElevatedRole(undefined)).toEqual(false);
  });

  it('returns false when member does not have elevated role', () => {
    const nonElevatedRole: Role = ({
      id: '123456',
      name: 'gibberish'
    } as unknown) as Role;

    const member: GuildMember = ({
      hasPermission: () => false,
      roles: {
        cache: new Collection([[nonElevatedRole.id, nonElevatedRole]])
      } as GuildMemberRoleManager
    } as unknown) as GuildMember;

    expect(userHasElevatedRole(member)).toEqual(false);
  });

  it('returns true when member is admin', () => {
    const member: GuildMember = ({
      hasPermission: (permission: number) => permission === Permissions.FLAGS.ADMINISTRATOR
    } as unknown) as GuildMember;

    expect(userHasElevatedRole(member)).toEqual(true);
  });

  it('returns true when member has elevated role', () => {
    const elevatedRole: Role = ({
      id: '123456',
      name: config.elevatedRoles[0]
    } as unknown) as Role;

    const member: GuildMember = ({
      hasPermission: () => false,
      roles: {
        cache: new Collection([[elevatedRole.id, elevatedRole]])
      } as GuildMemberRoleManager
    } as unknown) as GuildMember;

    expect(userHasElevatedRole(member)).toEqual(true);
  });
});
