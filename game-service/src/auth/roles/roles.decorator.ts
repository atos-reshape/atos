import { SetMetadata } from '@nestjs/common';

export enum ROLES {
  ADMIN,
  PLAYER,
}

/**
 * Defines the types of users that can access / execute a certain action.
 * @param roles are the roles the user must have one of.
 */
export const Roles = (...roles: ROLES[]) => SetMetadata('roles', roles);
