import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Lobby } from './lobby.entity';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { Round } from '../round/round.entity';

@Injectable()
export class LobbyService {
  constructor(
    @InjectRepository(Lobby)
    private readonly lobbyRepository: EntityRepository<Lobby>,
    @InjectRepository(Round)
    private readonly roundRepository: EntityRepository<Round>,
  ) {}

  getAll(): Promise<Lobby[]> {
    return this.lobbyRepository.findAll();
  }

  async createNewLobby(settings: CreateLobbyDto): Promise<Lobby> {
    const lobby = this.lobbyRepository.create({ title: settings.title });
    const round = this.roundRepository.create({ cards: settings.cards });
    lobby.rounds.add(round);

    await this.lobbyRepository.persistAndFlush(lobby);

    // Now set this first round as the current round
    lobby.currentRound = round;
    await this.lobbyRepository.persistAndFlush(lobby);

    return lobby;
  }

  getById(id: string): Promise<Lobby> {
    return this.lobbyRepository.findOne(
      { id: id },
      { populate: ['currentRound'] },
    );
  }
}
