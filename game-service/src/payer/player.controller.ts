import { Controller, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerResponseDto } from './dto/player-response.dto';

@ApiTags('Player')
@Controller('lobbies/:lobby_id/players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  //Player Actions

  @ApiOperation({ summary: 'Get all players' })
  @ApiResponse({
    status: 200,
    description: 'Returns all players of a lobby',
    type: [PlayerResponseDto],
  })
  @Get()
  async getPlayers(
    @Param('lobby_id') lobby_id: string,
  ): Promise<PlayerResponseDto[]> {
    const players = await this.playerService.getAllPlayersForLobby(lobby_id);
    return players.map((player) => new PlayerResponseDto(player));
  }

  @ApiOperation({ summary: 'Get player by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns player by id ',
    type: PlayerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Player not found' })
  @Get(':id')
  async getPlayer(@Param('id') id: string): Promise<PlayerResponseDto> {
    return new PlayerResponseDto(await this.playerService.findPlayer(id));
  }
}
