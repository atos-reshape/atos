import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyService } from './lobby.service';
import {
  ClassSerializerInterceptor,
  SerializeOptions,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { LobbyResponseDto } from './dto';
import { ExceptionsFilter } from '../sockets/exceptionFilter';
import { Joined } from '../sockets/joined.type';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/lobby/',
  transports: ['websocket'],
})
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new ExceptionsFilter())
export class LobbyGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly lobbyService: LobbyService) {}

  @SubscribeMessage('joinLobby')
  @SerializeOptions({ groups: ['withCurrentRound'] })
  async joinLobby(
    @ConnectedSocket() socket: Socket,
    @MessageBody() lobbyId: string,
  ): Promise<LobbyResponseDto> {
    if (!lobbyId) throw new WsException('Lobby id is missing');

    // Should still check if this lobby exists / is still playing
    const lobby = await this.lobbyService.getById(lobbyId);

    socket.join(lobbyId);
    socket['lobbyId'] = lobbyId;

    return new LobbyResponseDto(lobby);
  }

  @SubscribeMessage('getLobby')
  @SerializeOptions({ groups: ['withCurrentRound'] })
  async getLobby(@ConnectedSocket() socket: Joined): Promise<LobbyResponseDto> {
    const lobby = await this.lobbyService.getById(socket.lobbyId);

    return new LobbyResponseDto(lobby);
  }
}
