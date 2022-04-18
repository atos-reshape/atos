import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Lobby } from './lobby.entity';
import { CreateLobbyDto } from './dto';
import { Round } from '../round/round.entity';
import { RoundService } from '../round/round.service';

type INCLUDES = 'currentRound' | 'rounds';

@Injectable()
export class LobbyService {
  constructor(
    @InjectRepository(Lobby)
    private readonly lobbyRepository: EntityRepository<Lobby>,
    @InjectRepository(Round)
    private readonly roundRepository: EntityRepository<Round>,
    private readonly roundService: RoundService,
  ) {}

  /**
   * Retrieve all lobbies from the database.
   * @returns an array of Lobbies.
   */
  getAll(): Promise<Lobby[]> {
    return this.lobbyRepository.findAll();
  }

  /**
   * Create a new lobby with an initial round.
   * @param settings are the settings to create this lobby.
   * @returns the created lobby.
   */
  async createNewLobby(settings: CreateLobbyDto): Promise<Lobby> {
    const lobby = this.lobbyRepository.create({ title: settings.title });
    await this.lobbyRepository.persist(lobby);

    await this.roundService.createNewRoundForLobby(lobby, settings);

    return lobby;
  }

  /**
   * Retrieve a specific lobby from the database.
   * @param id is the id of the lobby.
   * @param populate are the relations that should be present.
   * @returns the lobby including the current round.
   * @exception NotFoundException if the given id does not match a lobby.
   */
  async getById(
    id: string,
    populate: INCLUDES[] = ['currentRound'],
  ): Promise<Lobby> {
    const lobby = await this.lobbyRepository.findOne({ id: id }, { populate });

    if (!lobby) throw new NotFoundException('Lobby not found');

    return lobby;
  }

  /**
   * Retrieve a specific lobby from the database.
   * @param code is the unique code of the lobby.
   * @returns the lobby that matches to code.
   * @exception NotFoundException if the given code does not match a lobby.
   */
  async getByGameCode(code: string): Promise<Lobby> {
    const lobby = await this.lobbyRepository.findOne({ code });

    if (!lobby) throw new NotFoundException('Lobby not found');

    return lobby;
  }
}
