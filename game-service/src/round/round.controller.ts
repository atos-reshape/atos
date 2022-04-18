import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoundService } from './round.service';
import { RoundResponseDto, CreateRoundDto } from './dto';
import { RoundCommand } from './round.command';
import { UpdateCardsDto } from './dto/update-cards.dto';
import { SelectedCardsResponseDto } from '../payer/dto/selected-cards-response.dto';
import { SelectedCardsService } from '../payer/selectedCards.service';

@ApiTags('Round')
@Controller('lobbies/:lobby_id/rounds')
export class RoundController {
  constructor(
    private readonly roundService: RoundService,
    private readonly roundCommand: RoundCommand,
    private readonly selectedService: SelectedCardsService,
  ) {}

  @ApiOperation({ summary: 'Get all rounds' })
  @ApiOkResponse({
    description: 'Returns all rounds of a lobby',
    type: [RoundResponseDto],
  })
  @Get()
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
  @Post()
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
  @Put(':id/start')
  async startRound(@Param('id') id: string) {
    return this.roundCommand.startRound(id);
  }

  @ApiOperation({ summary: 'End a round' })
  @ApiOkResponse({ description: 'Successfully ended the round' })
  @ApiBadRequestResponse({
    description: 'Could not end the round because it is not active',
  })
  @ApiNotFoundResponse({ description: 'Could not find the requested round' })
  @Put(':id/end')
  async endRound(@Param('id') id: string) {
    return this.roundCommand.endRound(id);
  }

  @ApiOperation({ summary: 'Update the cards of a round' })
  @ApiOkResponse({ description: 'Successfully updated the cards of the round' })
  @ApiNotFoundResponse({ description: 'Round was not found' })
  @Put(':id/cards')
  async updateCards(
    @Param('id') id: string,
    @Body() params: UpdateCardsDto,
  ): Promise<RoundResponseDto> {
    return new RoundResponseDto(
      await this.roundCommand.updateCards(id, params),
    );
  }

  @ApiOperation({ summary: 'Get selected cards of a player by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns selected cards by player id ',
    type: SelectedCardsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Selected cards not found' })
  @Get('/:round_id/cards/:player_id')
  async getPlayerSelectedCards(
    @Param('round_id') id: string,
    @Param('player_id') playerId: string,
  ): Promise<SelectedCardsResponseDto> {
    return new SelectedCardsResponseDto(
      await this.selectedService.findSelectedCards(playerId, id),
    );
  }

  @ApiOperation({ summary: 'Get selected cards of all the players' })
  @ApiResponse({
    status: 200,
    description: 'Returns all the selected cards in a round ',
    type: SelectedCardsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Player not found' })
  @Get('/:round_id/cards')
  async getAllSelectedCards(
    @Param('round_id') roundId: string,
  ): Promise<SelectedCardsResponseDto[]> {
    const selected = await this.selectedService.getAllSelectedCards(roundId);
    return selected.map((cards) => new SelectedCardsResponseDto(cards));
  }

  @ApiOperation({ summary: 'Add a card to the selected cards of a player' })
  @ApiResponse({
    status: 200,
    description: 'Returns the new selected cards array ',
    type: SelectedCardsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'New card could not be added' })
  @Put('/:round_id/cards/:player_id/:id')
  async addSelectedCard(
    @Param('player_id') playerId: string,
    @Param('round_id') roundId: string,
    @Param('id') id: string,
  ): Promise<SelectedCardsResponseDto> {
    return new SelectedCardsResponseDto(
      await this.selectedService.addSelectedCard(playerId, roundId, id),
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
  @Delete('/:round_id/cards/:player_id/remove/:id')
  async removeSelectedCard(
    @Param('player_id') playerId: string,
    @Param('round_id') roundId: string,
    @Param('id') id: string,
  ): Promise<SelectedCardsResponseDto> {
    return new SelectedCardsResponseDto(
      await this.selectedService.removeSelectedCard(playerId, roundId, id),
    );
  }
}
