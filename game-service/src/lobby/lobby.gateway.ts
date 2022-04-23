import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { LobbyService } from './lobby.service';
import {
  ClassSerializerInterceptor,
  SerializeOptions,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LobbyResponseDto } from './dto';
import { ExceptionsFilter } from '../sockets/exceptionFilter';
import { Joined } from '../sockets/joined.type';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';
import { SocketRolesGuard } from '../auth/roles/socket-roles.guard';
import { ROLES, Roles } from '../auth/roles/roles.decorator';

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
export class LobbyGateway {
  constructor(
    private readonly lobbyService: LobbyService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * This method handles incoming messages by checking their auth token.
   * If it does have one, or is invalid it returns unauthorized message.
   * If it is it will assign correct attributes to this connection,
   * based on role: Admin / Player.
   * @param socket incoming socket connection.
   */
  /* istanbul ignore next */
  handleConnection(socket: Socket): void {
    try {
      const token = socket.handshake.auth.token;
      const payload: JwtPayloadDto = this.jwtService.verify(token);

      if (!!payload.playerId && !!payload.lobbyId) {
        // Means we've got a player connection
        socket['playerId'] = payload.playerId;
        socket['lobbyId'] = payload.lobbyId;
        socket.join(payload.lobbyId);
      }
    } catch (e) {
      socket.send('unauthorized', {
        message: 'You dont have access since you need to log in first',
      });
      socket.disconnect();
    }
  }

  @SubscribeMessage('joinLobby')
  @SerializeOptions({ groups: ['withCurrentRound'] })
  @Roles(ROLES.ADMIN)
  async joinLobby(
    @ConnectedSocket() socket: Socket,
    @MessageBody() lobbyId: string,
  ): Promise<boolean> {
    if (!lobbyId) throw new WsException('Lobby id is missing');

    // Should still check if this lobby exists / is still playing
    await this.lobbyService.getById(lobbyId);

    socket.join(lobbyId);
    socket['lobbyId'] = lobbyId;

    return true;
  }

  @SubscribeMessage('getLobby')
  @SerializeOptions({ groups: ['withCurrentRound'] })
  @Roles(ROLES.PLAYER, ROLES.ADMIN)
  async getLobby(@ConnectedSocket() socket: Joined): Promise<LobbyResponseDto> {
    const lobby = await this.lobbyService.getById(socket.lobbyId);

    return new LobbyResponseDto(lobby);
  }
}
