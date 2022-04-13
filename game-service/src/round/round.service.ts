import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Round } from './round.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Lobby } from '../lobby/lobby.entity';
import { CreateRoundDto } from './dto';
import { SelectedCards } from '../payer/selectedCards.entity';
import { SelectedCardsService } from '../payer/selectedCards.service';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Lobby)
    private readonly lobbyRepository: EntityRepository<Lobby>,
    @InjectRepository(Round)
    private readonly roundRepository: EntityRepository<Round>,
    @InjectRepository(SelectedCards)
    private readonly selectedCardsRepository: EntityRepository<SelectedCards>,
  ) {}

  /**
   * Retrieve all rounds that belong to a lobby.
   * @param lobby_id is the id of the lobby.
   * @returns an array of rounds.
   */
  getAllForLobby(lobby_id: string): Promise<Round[]> {
    return this.roundRepository.find({ lobby: lobby_id });
  }

  /**
   * Retrieve a specific round from the database.
   * @param id is the id of the round.
   * @returns the round matching the given id.
   * @exception NotFoundException if the given id does not match a round.
   */

  async findRound(id: string) {
    const round = await this.roundRepository.findOne(id);

    if (!round) throw new NotFoundException('Round not found');

    return round;
  }

  /**
   * Create a new round.
   * @param lobby that should get a new round.
   * @param settings are the properties of the new round.
   * @exception NotFoundException if the given lobby_id does not match a lobby.
   * @exception BadRequestException if the lobby already has a round present / active.
   */
  async createNewRoundForLobby(
    lobby: Lobby,
    settings: CreateRoundDto,
  ): Promise<Round> {
    if (lobby.currentRound !== undefined)
      if (!lobby.currentRound.hasEnded())
        throw new BadRequestException(
          'Lobby already has an active or prepared round',
        );

    const round = this.roundRepository.create({ cards: settings.cards });

    const selCardsService = new SelectedCardsService(this.selectedCardsRepository);
    selCardsService.createSelectedCardsForPlayer(lobby, round);

    lobby.rounds.add(round);
    await this.roundRepository.persistAndFlush(round);
    lobby.currentRound = round;
    await this.lobbyRepository.persistAndFlush(lobby);

    return round;
  }

  /**
   * This method will handle the logic for starting a round.
   * @param round is the round to start.
   * @exception BadRequestException if the round already started.
   */
  async startRound(round: Round): Promise<void> {
    if (round.hasStarted())
      throw new BadRequestException('Round already started');

    round.startedAt = new Date();

    await this.roundRepository.persistAndFlush(round);
  }

  /**
   * This method will handle the logic for starting a round.
   * @param round is the round to end.
   * @exception BadRequestException if the round already ended.
   */
  async endRound(round: Round): Promise<void> {
    if (!round.isActive()) throw new BadRequestException('Round is not active');

    round.endedAt = new Date();

    await this.roundRepository.persistAndFlush(round);
  }

  /**
   * Get the selected cards of a player.
   * @param id - The id of the player.
   * @param roundId - The round.
   * @returns The selected cards of the player.
   */
  async getPlayerSelectedCards(
    id: string,
    roundId: string,
  ): Promise<SelectedCards> {
    const playerSelectedCards = await this.selectedCardsRepository.findOne({
      player: id,
      round: roundId,
    });

    if (!playerSelectedCards)
      throw new NotFoundException('Could not find player selected cards');

    return playerSelectedCards;
  }

  /**
   * Get all the selected cards.
   * @param roundId - The id of the round.
   * @returns The selected cards of the round.
   */
  async getAllSelectedCards(roundId: string): Promise<SelectedCards[]> {
    const allSelectedCards = await this.selectedCardsRepository.find({
      round: roundId,
    });

    if (!allSelectedCards)
      throw new NotFoundException('Could not find selected cards in round');

    return allSelectedCards;
  }

  /**
   * Update the selected cards.
   * @param playerId - The id of the player to update.
   * @param roundId - The round to update.
   * @param newCard - The card to add to the selected cards.
   * @returns The updated selected cards.
   */
  async addSelectedCard(
    playerId: string,
    roundId: string,
    newCard: string,
  ): Promise<SelectedCards> {
    const selectedCards = await this.selectedCardsRepository.findOne({
      player: playerId,
      round: roundId,
    });

    if (!selectedCards)
      throw new NotFoundException('Could not find selected cards of player');

    selectedCards.cards.push(newCard);
    await this.selectedCardsRepository.flush();

    return selectedCards;
  }

  /**
   * Update the selected cards.
   * @param playerId - The id of the player to update.
   * @param roundId - The round to update.
   * @param removedCard - The card to add to the selected cards.
   * @returns The updated selected cards.
   */
  async removeSelectedCard(
    playerId: string,
    roundId: string,
    removedCard: string,
  ): Promise<SelectedCards> {
    const selectedCards = await this.selectedCardsRepository.findOne({
      player: playerId,
      round: roundId,
    });

    if (!selectedCards)
      throw new NotFoundException('Could not find selected cards of player');

    const index = selectedCards.cards.indexOf(removedCard);
    if (index > -1) {
      selectedCards.cards.splice(index, 1);
    }
    await this.selectedCardsRepository.flush();

    return selectedCards;
  }
}
