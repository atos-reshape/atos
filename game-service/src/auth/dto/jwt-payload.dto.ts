export class JwtPayloadDto {
  lobbyId: string;

  playerId: string;

  constructor(lobby_id: string, player_id: string) {
    this.lobbyId = lobby_id;
    this.playerId = player_id;
  }
}
