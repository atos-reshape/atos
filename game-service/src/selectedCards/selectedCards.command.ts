import { Injectable } from '@nestjs/common';
import { SelectedCardsService } from './selectedCards.service';
import { SocketService } from '../lobby/socket.service';
import { SelectedCards } from './selectedCards.entity';
import { RoundService } from '../round/round.service';
import { LikeCardCmd } from './dto/like-card.cmd';

@Injectable()
export class SelectedCardsCommand {
  constructor(
    private readonly selectedService: SelectedCardsService,
    private readonly roundService: RoundService,
    private readonly socketService: SocketService,
  ) {}

  async likeACard(cmd: LikeCardCmd): Promise<SelectedCards> {
    const round = await this.roundService.findRound(cmd.roundId);
    const selected = await this.selectedService.addCardToLiked(cmd);

    this.socketService.send(round.lobby.id, 'cards.selected.updated', selected);

    return selected;
  }

  async unLikeACard(cmd: LikeCardCmd): Promise<SelectedCards> {
    const round = await this.roundService.findRound(cmd.roundId);
    const selected = await this.selectedService.removeCardFromLiked(cmd);

    this.socketService.send(round.lobby.id, 'cards.selected.updated', selected);

    return selected;
  }

  async finishedSelecting(
    roundId: string,
    playerId: string,
  ): Promise<SelectedCards> {
    const round = await this.roundService.findRound(roundId);

    const selected = this.selectedService.finishedSelecting(round, playerId);

    this.socketService.send(
      round.lobby.id,
      'cards.selected.finished',
      selected,
    );

    return selected;
  }
}
