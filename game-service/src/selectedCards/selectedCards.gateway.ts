import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import {
  ClassSerializerInterceptor,
  UnauthorizedException,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ExceptionsFilter } from '../sockets/exceptionFilter';
import { SelectedCardsService } from './selectedCards.service';
import { Joined } from '../sockets/joined.type';
import { LobbyService } from '../lobby/lobby.service';
import { PlayerSelectedCardsDto } from './dto/player-selected-cards.dto';
import { SelectedCardsResponseDto } from './dto/selected-cards-response.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/lobby/',
  transports: ['websocket'],
})
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new ExceptionsFilter())
export class SelectedCardsGateway {
  constructor(
    private readonly selectedService: SelectedCardsService,
    private readonly lobbyService: LobbyService,
  ) {}

  @SubscribeMessage('getSelectedCards')
  async getSelectedCards(
    @ConnectedSocket() socket: Joined,
  ): Promise<PlayerSelectedCardsDto> {
    if (!socket.lobbyId) throw new UnauthorizedException();

    const lobby = await this.lobbyService.getById(socket.lobbyId);
    const selected = await this.selectedService.getAllSelectedCards(
      lobby.currentRound.id,
    );

    const response: PlayerSelectedCardsDto = {};
    selected.map(
      (selected) =>
        (response[selected.player.id] = new SelectedCardsResponseDto(selected)),
    );
    return response;
  }

  @SubscribeMessage('getMySelectedCards')
  async getMySelectedCards(
    @ConnectedSocket() socket: Joined,
  ): Promise<SelectedCardsResponseDto> {
    if (!socket.lobbyId) throw new UnauthorizedException();

    const lobby = await this.lobbyService.getById(socket.lobbyId);
    const selected = await this.selectedService.findSelectedCards(
      socket.playerId,
      lobby.currentRound.id,
    );

    return new SelectedCardsResponseDto(selected);
  }
}
