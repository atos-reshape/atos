import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  ClassSerializerInterceptor,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ExceptionsFilter } from '../sockets/exceptionFilter';
import { Server } from 'socket.io';
import { PlayerService } from './player.service';
import { Joined } from '../sockets/joined.type';
import { PlayerResponseDto } from './dto/player-response.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/lobby/',
  transports: ['websocket'],
})
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new ExceptionsFilter())
export class PlayerGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly playerService: PlayerService) {}

  @SubscribeMessage('getPlayers')
  async getPlayers(
    @ConnectedSocket() socket: Joined,
  ): Promise<PlayerResponseDto[]> {
    const players = await this.playerService.getAllPlayersForLobby(
      socket.lobbyId,
    );
    return players.map((player) => new PlayerResponseDto(player));
  }
}
