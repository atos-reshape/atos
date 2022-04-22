import { Injectable, NotFoundException } from '@nestjs/common';
import { Lobby } from '../lobby/lobby.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Player } from './player.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { JoinLobbyDto } from '../auth/dto/join-lobby.dto';
import { SocketService } from '../lobby/socket.service';
import { SelectedCardsService } from '../selectedCards/selectedCards.service';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Lobby)
    private readonly lobbyRepository: EntityRepository<Lobby>,
    @InjectRepository(Player)
    private readonly playerRepository: EntityRepository<Player>,
    private readonly socketService: SocketService,
    private readonly selectedService: SelectedCardsService,
  ) {}

  /**
   * Retrieve all players that belong to a lobby.
   * @param lobby_id is the id of the lobby.
   * @returns an array of players.
   */
  getAllPlayersForLobby(lobby_id: string): Promise<Player[]> {
    return this.playerRepository.find({ lobby: lobby_id });
  }

  /**
   * Retrieve a specific player.
   * @param player_id is the id of the player.
   * @returns the found player.
   * @exception NotFoundException if the player was not found.
   */
  async findPlayer(player_id: string): Promise<Player> {
    const player = await this.playerRepository.findOne({ id: player_id });

    if (!player) throw new NotFoundException('Could not find player');

    return player;
  }

  /**
   * Add a new player to a lobby.
   * @param lobby is the lobby the new player should be added to.
   * @param name is the name of the player.
   */
  async addNewPlayer(lobby: Lobby, { name }: JoinLobbyDto): Promise<Player> {
    const player = this.playerRepository.create({ lobby, name });

    await this.playerRepository.persistAndFlush(player);

    if (!!lobby.currentRound)
      await this.selectedService.createForPlayer(lobby, player);

    this.socketService.send(lobby.id, 'player.joined', { player });

    return player;
  }
}
