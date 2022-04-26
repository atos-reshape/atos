import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { Reflector } from '@nestjs/core';
import { ROLES } from './roles.decorator';

/**
 * This is a guard specific for checking a JWT
 * Can be used on a gateway like this:
 * @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class SocketRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.get<ROLES[]>('roles', context.getHandler());
    if (!roles) return true;

    const socket = context.switchToWs().getClient<Socket>();
    const token = socket.handshake.auth.token;
    const payload: JwtPayloadDto = this.jwtService.verify(token);

    return (
      this.validPlayer(payload, socket, roles) ||
      this.validAdmin(payload, socket, roles)
    );
  }

  validPlayer(payload: JwtPayloadDto, socket: Socket, roles: ROLES[]): boolean {
    if (!roles.includes(ROLES.PLAYER)) return false;

    return !(!payload.playerId || !payload.lobbyId);
  }

  // TODO extend checking for valid admin payload
  // This can only be added after admin login using Azure AD
  validAdmin(payload: JwtPayloadDto, socket: Socket, roles: ROLES[]): boolean {
    return roles.includes(ROLES.ADMIN);
  }
}
