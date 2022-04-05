import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoundService } from './round.service';
import { RoundResponseDto, CreateRoundDto } from './dto';
import { SelectedCardsResponseDto } from '../payer/dto/selected-cards-response.dto';

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

  //Selected Cards Actions

  @ApiOperation({ summary: 'Get selected cards of a player by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns selected cards by player id ',
    type: SelectedCardsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Selected cards not found' })
  @Get('/:round_id/:player_id')
  async getPlayerSelectedCards(
    @Param('round_id') id: string,
    @Param('player_id') playerId: string,
  ): Promise<SelectedCardsResponseDto> {
    return new SelectedCardsResponseDto(
      await this.roundService.getPlayerSelectedCards(id, playerId),
    );
  }

  @ApiOperation({ summary: 'Get selected cards of all the players' })
  @ApiResponse({
    status: 200,
    description: 'Returns all the selected cards in a round ',
    type: SelectedCardsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Player not found' })
  @Get('/:round_id/selected-cards')
  async getAllSelectedCards(
    @Param('round_id') roundId: string,
  ): Promise<SelectedCardsResponseDto[]> {
    const selectedCards = await this.roundService.getAllSelectedCards(roundId);
    return selectedCards.map(
      (roundSelected) => new SelectedCardsResponseDto(roundSelected),
    );
  }

  @ApiOperation({ summary: 'Add a card to the selected cards of a player' })
  @ApiResponse({
    status: 200,
    description: 'Returns the new selected cards array ',
    type: SelectedCardsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'New card could not be added' })
  @Put('/:round_id/:player_id/add')
  async addSelectedCard(
    @Body() playerId: string,
    roundId: string,
    newCard: string,
  ): Promise<SelectedCardsResponseDto> {
    return new SelectedCardsResponseDto(
      await this.roundService.addSelectedCard(playerId, roundId, newCard),
    );
  }

  @ApiOperation({
    summary: 'Remove a card from the selected cards of a player',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the new selected cards array ',
    type: SelectedCardsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Old card could not be removed' })
  @Put('/:round_id/:player_id/remove')
  async removeSelectedCard(
    @Body() playerId: string,
    roundId: string,
    newCard: string,
  ): Promise<SelectedCardsResponseDto> {
    return new SelectedCardsResponseDto(
      await this.roundService.removeSelectedCard(playerId, roundId, newCard),
    );
  }
}
