import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { SelectedCards } from './selectedCards.entity';
import { Lobby } from 'src/lobby/lobby.entity';
import { Round } from 'src/round/round.entity';
import { Player } from '../player/player.entity';
import { LikeCardCmd } from './dto/like-card.cmd';

@Injectable()
export class SelectedCardsService {
  constructor(
    @InjectRepository(SelectedCards)
    public readonly selectedCardsRepository: EntityRepository<SelectedCards>,
  ) { }

  /**
   * Create new selected cards entity for each player in the lobby.
   * @param lobby is the the lobby.
   * @param round is the current round of the game.
   * @returns an array of selected cards.
   */
  async prepareSelectedCards(lobby: Lobby, round: Round): Promise<void> {
    const entities = (await lobby.players.loadItems()).map((player: Player) =>
      this.selectedCardsRepository.create({ player, round }),
    );

    // Save the entire array of objects at once to save time XD
    await this.selectedCardsRepository.persistAndFlush(entities);
  }

  /**
   * Create new selected cards entity for a new player in the lobby.
   * @param lobby is the lobby.
   * @param player is the player.
   * @returns The selected cards of the player.
   */
  async createForPlayer(lobby: Lobby, player: Player): Promise<void> {
    const selected = this.selectedCardsRepository.create({
      player: player,
      round: lobby.currentRound.id,
    });

    await this.selectedCardsRepository.persistAndFlush(selected);
  }

  /**
   * Get the selected cards of a player.
   * @param playerId - The id of the player.
   * @param roundId - The round.
   * @returns The selected cards of the player.
   */
  async findSelectedCards(
    playerId: string,
    roundId: string,
  ): Promise<SelectedCards> {
    const selectedCards = await this.selectedCardsRepository.findOne({
      player: playerId,
      round: roundId,
    });

    if (!selectedCards)
      throw new NotFoundException('Could not find selected cards of player');

    return selectedCards;
  }

  /**
   * Get all the selected cards.
   * @param roundId - The id of the round.
   * @returns The selected cards of the round.
   */
  async getAllSelectedCards(roundId: string): Promise<SelectedCards[]> {
    return this.selectedCardsRepository.find({ round: roundId });
  }

  /**
   * Update the selected cards.
   * @param playerId - The id of the player to update.
   * @param roundId - The round to update.
   * @param newCard - The card to add to the selected cards.
   * @returns The updated selected cards.
   */
  async addCardToLiked({
    cardId,
    roundId,
    playerId,
  }: LikeCardCmd): Promise<SelectedCards> {
    const selectedCards = await this.findSelectedCards(playerId, roundId);

    selectedCards.cards.push(cardId);
    await this.selectedCardsRepository.persistAndFlush(selectedCards);

    return selectedCards;
  }

  /**
   * Update the selected cards.
   * @param playerId - The id of the player to update.
   * @param roundId - The round to update.
   * @param removedCard - The card to add to the selected cards.
   * @returns The updated selected cards.
   */
  async removeCardFromLiked({
    cardId,
    roundId,
    playerId,
  }: LikeCardCmd): Promise<SelectedCards> {
    const selected = await this.findSelectedCards(playerId, roundId);

    selected.cards = selected.cards.filter((id) => id !== cardId);
    await this.selectedCardsRepository.persistAndFlush(selected);

    return selected;
  }

  /**
 * Update the selected cards.
 * @param roundId - The id of the player to update.
 * @param playerId - The round to update.
 * @returns The updated selected cards.
 */
  async finishedSelecting(round: Round, playerId: string): Promise<SelectedCards> {
    const selected = await this.findSelectedCards(playerId, round.id);
    if (round.selectableCards != selected.cards.length) { throw new Error('You need to have selected the exact number of cards for this round') };

    selected.finishedSelecting = new Date();
    await this.selectedCardsRepository.persistAndFlush(selected);

    return selected;
  }
}
