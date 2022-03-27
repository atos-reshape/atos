import { Injectable } from '@nestjs/common';
import { PlayerService } from '../payer/player.service';
import { JwtService } from '@nestjs/jwt';
import { JoinResponseDto } from './dto/join-response.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';
import { LobbyService } from '../lobby/lobby.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly jwtService: JwtService,
    private readonly lobbyService: LobbyService,
  ) {}

  /**
   * Allows a new user to join a game by game code.
   * @param code is the code of the game.
   * @param params contain information about the player.
   */
  async joinUsingCode(code: string, params: JoinLobbyDto) {
    const lobby = await this.lobbyService.getByGameCode(code);
    const player = await this.playerService.addNewPlayer(lobby, params);

    return this.createPlayerToken(lobby.id, player.id);
  }

  /**
   * Creates a new JWT containing information about the current player and lobby.
   * @param lobbyId is the joined lobby.
   * @param playerId is the player who joined.
   */
  createPlayerToken(lobbyId: string, playerId: string): JoinResponseDto {
    const payload: JwtPayloadDto = { lobbyId, playerId };
    return { lobbyId, accessToken: this.jwtService.sign(payload) };
  }
}
