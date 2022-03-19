import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Round } from './round.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Lobby } from '../lobby/lobby.entity';
import { CreateRoundDto } from './dto/create-round.dto';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Lobby)
    private readonly lobbyRepository: EntityRepository<Lobby>,
    @InjectRepository(Round)
    private readonly roundRepository: EntityRepository<Round>,
  ) {}

  getAllForLobby(lobby_id: string): Promise<Round[]> {
    return this.roundRepository.find({ lobby: lobby_id });
  }

  async createNewRoundForLobby(
    lobby_id: string,
    settings: CreateRoundDto,
  ): Promise<Round> {
    const lobby = await this.lobbyRepository.findOne(
      { id: lobby_id },
      { populate: ['rounds'] },
    );
    const round = this.roundRepository.create({ cards: settings.cards });

    lobby.rounds.add(round);
    await this.roundRepository.persistAndFlush(round);
    lobby.currentRound = round;
    await this.lobbyRepository.persistAndFlush(lobby);

    return round;
  }
}
