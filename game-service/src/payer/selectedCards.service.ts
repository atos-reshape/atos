import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { SelectedCards } from '../payer/selectedCards.entity';
import { Lobby } from 'src/lobby/lobby.entity';
import { Round } from 'src/round/round.entity';

@Injectable()
export class SelectedCardsService {
    constructor(
        @InjectRepository(SelectedCards)
        public readonly selectedCardsRepository: EntityRepository<SelectedCards>,
    ) { }

    /**
     * Create new selected cards entity for each player in the lobby.
     * @param lobby is the the lobby.
     * @param currentRound is the current round of the game.
     * @returns an array of selected cards.
     */
    async createSelectedCardsForPlayer(lobby: Lobby, currentRound: Round): Promise<SelectedCards[]> {

        const players = lobby.players;
        const selectedCardsArray = [];
        for (let i = 0; i < players.length; i++) {
            const selectedCards = this.selectedCardsRepository.create({
                player: lobby.players[i],
                round: currentRound,
            });
            selectedCardsArray.push(selectedCards);
            await this.selectedCardsRepository.persistAndFlush(selectedCards);
        }

        return selectedCardsArray;
    }
}
