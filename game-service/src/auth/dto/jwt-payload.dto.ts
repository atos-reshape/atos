export class JwtPayloadDto {
  lobbyId: string;

  playerId: string;

  constructor(lobbyId: string, playerId: string) {
    this.lobbyId = lobbyId;
    this.playerId = playerId;
  }
}
