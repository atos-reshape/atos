import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoundService } from './round.service';
import { RoundResponseDto, CreateRoundDto } from './dto';

@Controller('lobbies/:lobby_id/rounds')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @ApiOperation({ summary: 'Get all rounds' })
  @ApiResponse({
    status: 200,
    description: 'Returns all rounds of a lobby',
    type: [RoundResponseDto],
  })
  @Get()
  async getRounds(
    @Param('lobby_id') lobby_id: string,
  ): Promise<RoundResponseDto[]> {
    const rounds = await this.roundService.getAllForLobby(lobby_id);
    return rounds.map((round) => new RoundResponseDto(round));
  }

  @ApiOperation({ summary: 'Create a new round' })
  @ApiResponse({
    status: 201,
    description: 'Round created',
    type: RoundResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid round' })
  @ApiResponse({ status: 404, description: 'Lobby was not found' })
  @Post()
  async createRound(
    @Param('lobby_id') lobby_id: string,
    @Body() params: CreateRoundDto,
  ): Promise<RoundResponseDto> {
    const round = await this.roundService.createNewRoundForLobby(
      lobby_id,
      params,
    );
    return new RoundResponseDto(round);
  }
}
