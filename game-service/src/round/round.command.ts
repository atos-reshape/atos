import { RoundService } from './round.service';
import { Injectable } from '@nestjs/common';
import { SocketService } from '../lobby/socket.service';
import { CreateRoundDto } from './dto';
import { LobbyService } from '../lobby/lobby.service';
import { UpdateCardsDto } from './dto/update-cards.dto';

@Injectable()
export class RoundCommand {
  constructor(
    private readonly roundService: RoundService,
    private readonly socketService: SocketService,
    private readonly lobbyService: LobbyService,
  ) {}

  /**
   * This method will handle the logic for starting a round.
   * @param id is the id of the round to start.
   * @exception NotFoundException if the round was not found.
   * @exception BadRequestException if the round already started.
   */
  async startRound(id: string): Promise<void> {
    const round = await this.roundService.findRound(id);

    await this.roundService.startRound(round);

    this.socketService.send(round.lobby.id, 'round.started', round);
  }

  /**
   * This method will handle the logic for starting a round.
   * @param id is the id of the round to end.
   * @exception NotFoundException if the round was not found.
   * @exception BadRequestException if the round already ended.
   */
  async endRound(id: string): Promise<void> {
    const round = await this.roundService.findRound(id);

    await this.roundService.endRound(round);

    this.socketService.send(round.lobby.id, 'round.ended', round);
  }

  /**
   * Creates a new round for an existing lobby, if there is no round
   * already existing or running.
   * @param lobbyId is the id of the lobby.
   * @param round are the parameters used to create the new lobby.
   * @exception NotFoundException if the lobby was not found.
   * @exception BadRequestException if the lobby already has a round present / active.
   */
  async createNewRound(lobbyId: string, round: CreateRoundDto) {
    const lobby = await this.lobbyService.getById(lobbyId, [
      'currentRound',
      'rounds',
    ]);

    const newRound = await this.roundService.createNewRoundForLobby(
      lobby,
      round,
    );

    this.socketService.send(lobby.id, 'round.created', newRound);

    return newRound;
  }

  /**
   * Updated the cards of the already existing not yet started round.
   * @param cards are the id's of the new cards.
   * @param id is the id or the round.
   * @exception NotFoundException if the lobby was not found.
   * @exception BadRequestException if the round already started.
   */
  async updateCards(id: string, { cards }: UpdateCardsDto) {
    const round = await this.roundService.findRound(id);

    await this.roundService.updateCards(round, cards);

    this.socketService.send(round.lobby.id, 'round.updated', round);

    return round;
  }
}
