import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  ClassSerializerInterceptor,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExceptionsFilter } from '../sockets/exceptionFilter';
import { Server } from 'socket.io';
import { PlayerService } from './player.service';
import { Joined } from '../sockets/joined.type';
import { PlayerResponseDto } from './dto/player-response.dto';
import { ROLES, Roles } from '../auth/roles/roles.decorator';
import { SocketRolesGuard } from '../auth/roles/socket-roles.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/lobby/',
  transports: ['websocket'],
})
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new ExceptionsFilter())
@UseGuards(SocketRolesGuard)
export class PlayerGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly playerService: PlayerService) {}

  @SubscribeMessage('getPlayers')
  @Roles(ROLES.PLAYER, ROLES.ADMIN)
  async getPlayers(
    @ConnectedSocket() socket: Joined,
  ): Promise<PlayerResponseDto[]> {
    if (!socket.lobbyId) throw new UnauthorizedException();

    const players = await this.playerService.getAllPlayersForLobby(
      socket.lobbyId,
    );
    return players.map((player) => new PlayerResponseDto(player));
  }
}
