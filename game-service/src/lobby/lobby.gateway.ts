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
    @MessageBody() lobby_id: string,
  ): Promise<LobbyResponseDto> {
    if (!lobby_id) throw new WsException('Lobby id is missing');

    // Should still check if this lobby exists / is still playing
    const lobby = await this.lobbyService.getById(lobby_id);

    socket.join(lobby_id);

    return new LobbyResponseDto(lobby);
  }
}
