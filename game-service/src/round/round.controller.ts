import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoundService } from './round.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { RoundResponseDto } from './dto/round-response.dto';

@Controller('lobbies/:lobby_id/rounds')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @Get()
  async getRounds(
    @Param('lobby_id') lobby_id: string,
  ): Promise<RoundResponseDto[]> {
    const rounds = await this.roundService.getAllForLobby(lobby_id);
    return rounds.map((round) => new RoundResponseDto(round));
  }

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
