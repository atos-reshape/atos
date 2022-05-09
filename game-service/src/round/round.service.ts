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
import { SelectedCardsService } from '../selectedCards/selectedCards.service';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Lobby)
    private readonly lobbyRepository: EntityRepository<Lobby>,
    @InjectRepository(Round)
    private readonly roundRepository: EntityRepository<Round>,
    private readonly selectedCardsService: SelectedCardsService,
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
   * Updates the cards of a specific round.
   * @param round is the round that should be updated.
   * @param cards are the new cards of that round.
   * @exception BadRequestException if the round already started.
   */
  async updateCards(round: Round, cards: string[]): Promise<void> {
    if (round.hasStarted())
      throw new BadRequestException('Round already started');

    this.roundRepository.assign(round, { cards });

    return this.roundRepository.persistAndFlush(round);
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
    if (!!lobby.currentRound)
      if (!lobby.currentRound.hasEnded())
        throw new BadRequestException(
          'Lobby already has an active or prepared round',
        );

    const round = this.roundRepository.create({
      cards: settings.cards,
      selectableCards: settings.selectableCards,
    });

    lobby.rounds.add(round);
    lobby.currentRound = round;
    await this.roundRepository.persistAndFlush(round);
    await this.selectedCardsService.prepareSelectedCards(lobby, round);

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
}
