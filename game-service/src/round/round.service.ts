import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Round } from './round.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Lobby } from '../lobby/lobby.entity';
import { CreateRoundDto } from './dto';
import { SelectedCards } from '../payer/selectedCards.entity';

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
   * Create a new round.
   * @param lobby_id is the id of the lobby this round belongs to.
   * @param settings are the properties of the new round.
   * @exception NotFoundException if the given lobby_id does not match a lobby.
   */
  async createNewRoundForLobby(
    lobby_id: string,
    settings: CreateRoundDto,
  ): Promise<Round> {
    const lobby = await this.findLobby(lobby_id);
    const round = this.roundRepository.create({ cards: settings.cards });

    const players = lobby.players;
    for (let i = 0; i < players.length; i++) {
      const selectedCards = this.selectedCardsRepository.create({
        player: lobby.players[i],
        round: round,
      });
      await this.selectedCardsRepository.persistAndFlush(selectedCards);
    }

    lobby.rounds.add(round);
    await this.roundRepository.persistAndFlush(round);
    lobby.currentRound = round;
    await this.lobbyRepository.persistAndFlush(lobby);

    return round;
  }

  /**
   * Retrieve a specific lobby from the database.
   * @param id is the id of the lobby.
   * @returns the lobby including the associated rounds.
   * @exception NotFoundException if the given id does not match a lobby.
   */
  private async findLobby(id: string) {
    const lobby = await this.lobbyRepository.findOne(
      { id },
      { populate: ['rounds'] },
    );

    if (!lobby) throw new NotFoundException('Lobby not found');

    return lobby;
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
      throw new NotFoundException('Could not find selected cards of player!');

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
      throw new NotFoundException('Could not find selected cards of player!');

    const index = selectedCards.cards.indexOf(removedCard);
    if (index > -1) {
      selectedCards.cards.splice(index, 1);
    }
    await this.selectedCardsRepository.flush();

    return selectedCards;
  }
}
