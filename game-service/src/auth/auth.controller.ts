import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoinLobbyDto } from './dto/join-lobby.dto';
import { LobbyService } from '../lobby/lobby.service';
import { PlayerService } from '../payer/player.service';
import { AuthService } from './auth.service';
import { JoinResponseDto } from './dto/join-response.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly lobbyService: LobbyService,
    private readonly playerService: PlayerService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Join a lobby as a player' })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined the lobby',
    type: JoinResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Lobby not found' })
  @Post('join/:code')
  async joinLobby(
    @Param('code') code: string,
    @Body() params: JoinLobbyDto,
  ): Promise<JoinResponseDto> {
    const lobby = await this.lobbyService.getByGameCode(code);
    const player = await this.playerService.addNewPlayer(lobby, params);

    return this.authService.createPlayerToken(lobby.id, player.id);
  }
}
