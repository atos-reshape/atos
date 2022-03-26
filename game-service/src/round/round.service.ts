import { Injectable, NotFoundException } from '@nestjs/common';
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
}
