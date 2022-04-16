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

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Lobby)
    private readonly lobbyRepository: EntityRepository<Lobby>,
    @InjectRepository(Round)
    private readonly roundRepository: EntityRepository<Round>,
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
}
