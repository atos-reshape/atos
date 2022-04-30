import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RoundService } from './round.service';
import { RoundResponseDto, CreateRoundDto } from './dto';
import { RoundCommand } from './round.command';
import { UpdateCardsDto } from './dto/update-cards.dto';

@ApiTags('Round')
@Controller('lobbies')
export class RoundController {
  constructor(
    private readonly roundService: RoundService,
    private readonly roundCommand: RoundCommand,
  ) {}

  @ApiOperation({ summary: 'Get all rounds' })
  @ApiOkResponse({
    description: 'Returns all rounds of a lobby',
    type: [RoundResponseDto],
  })
  @Get(':lobby_id/rounds')
  async getRounds(
    @Param('lobby_id') lobby_id: string,
  ): Promise<RoundResponseDto[]> {
    return (await this.roundService.getAllForLobby(lobby_id)).map(
      (round) => new RoundResponseDto(round),
    );
  }

  @ApiOperation({ summary: 'Create a new round' })
  @ApiCreatedResponse({ description: 'Round created', type: RoundResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid round or a round is already active / present',
  })
  @ApiNotFoundResponse({ description: 'Lobby was not found' })
  @Post(':lobby_id/rounds')
  async createRound(
    @Param('lobby_id') lobby_id: string,
    @Body() params: CreateRoundDto,
  ): Promise<RoundResponseDto> {
    return new RoundResponseDto(
      await this.roundCommand.createNewRound(lobby_id, params),
    );
  }

  @ApiOperation({ summary: 'Start a round' })
  @ApiOkResponse({ description: 'Successfully started the round' })
  @ApiBadRequestResponse({
    description: 'Could not start the round because it already started',
  })
  @ApiNotFoundResponse({ description: 'Could not find the requested round' })
  @Put('rounds/:id/start')
  async startRound(@Param('id') id: string) {
    return this.roundCommand.startRound(id);
  }

  @ApiOperation({ summary: 'End a round' })
  @ApiOkResponse({ description: 'Successfully ended the round' })
  @ApiBadRequestResponse({
    description: 'Could not end the round because it is not active',
  })
  @ApiNotFoundResponse({ description: 'Could not find the requested round' })
  @Put('rounds/:id/end')
  async endRound(@Param('id') id: string) {
    return this.roundCommand.endRound(id);
  }

  @ApiOperation({ summary: 'Update the cards of a round' })
  @ApiOkResponse({ description: 'Successfully updated the cards of the round' })
  @ApiNotFoundResponse({ description: 'Round was not found' })
  @Put('rounds/:id/cards')
  async updateCards(
    @Param('id') id: string,
    @Body() params: UpdateCardsDto,
  ): Promise<RoundResponseDto> {
    return new RoundResponseDto(
      await this.roundCommand.updateCards(id, params),
    );
  }
}
