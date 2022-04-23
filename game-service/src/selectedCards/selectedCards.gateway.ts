import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import {
  ClassSerializerInterceptor,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExceptionsFilter } from '../sockets/exceptionFilter';
import { SelectedCardsService } from './selectedCards.service';
import { Joined } from '../sockets/joined.type';
import { LobbyService } from '../lobby/lobby.service';
import { PlayerSelectedCardsDto } from './dto/player-selected-cards.dto';
import { SelectedCardsResponseDto } from './dto/selected-cards-response.dto';
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
export class SelectedCardsGateway {
  constructor(
    private readonly selectedService: SelectedCardsService,
    private readonly lobbyService: LobbyService,
  ) {}

  @Roles(ROLES.ADMIN)
  @SubscribeMessage('getSelectedCards')
  async getSelectedCards(
    @ConnectedSocket() socket: Joined,
  ): Promise<PlayerSelectedCardsDto> {
    if (!socket.lobbyId) throw new UnauthorizedException();

    const lobby = await this.lobbyService.getById(socket.lobbyId);
    const selected = await this.selectedService.getAllSelectedCards(
      lobby.currentRound.id,
    );

    return new PlayerSelectedCardsDto(selected);
  }

  @Roles(ROLES.PLAYER)
  @SubscribeMessage('getMySelectedCards')
  async getMySelectedCards(
    @ConnectedSocket() socket: Joined,
  ): Promise<SelectedCardsResponseDto> {
    if (!socket.lobbyId || !socket.playerId) throw new UnauthorizedException();

    const lobby = await this.lobbyService.getById(socket.lobbyId);
    const selected = await this.selectedService.findSelectedCards(
      socket.playerId,
      lobby.currentRound.id,
    );

    return new SelectedCardsResponseDto(selected);
  }
}
