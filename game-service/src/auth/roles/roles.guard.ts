import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from './roles.decorator';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

/**
 * Guard that checks if the user has access by role restriction.
 * Annotate function with:
 * @Roles(ROLES.PLAYER)
 * And add this guard like this:
 * @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
 */
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<ROLES[]>('roles', context.getHandler());
    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();

    return this.validPlayer(user, roles) || this.validAdmin(user, roles);
  }

  validPlayer(payload: JwtPayloadDto, roles: ROLES[]): boolean {
    if (!roles.includes(ROLES.PLAYER)) return false;

    return !(!payload.playerId || !payload.lobbyId);
  }

  validAdmin(payload: JwtPayloadDto, roles: ROLES[]): boolean {
    return roles.includes(ROLES.ADMIN);
  }
}
