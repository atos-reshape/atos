import { Injectable } from '@nestjs/common';
import { PlayerService } from '../payer/player.service';
import { JwtService } from '@nestjs/jwt';
import { JoinResponseDto } from './dto/join-response.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Creates a new JWT containing information about the current player and lobby.
   * @param lobby_id is the joined lobby.
   * @param player_id is the player who joined.
   */
  createPlayerToken(lobby_id: string, player_id: string): JoinResponseDto {
    const payload: JwtPayloadDto = { lobbyId: lobby_id, playerId: player_id };
    return { lobby_id: lobby_id, access_token: this.jwtService.sign(payload) };
  }
}
