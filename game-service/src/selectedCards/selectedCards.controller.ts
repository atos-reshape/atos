import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { SelectedCardsService } from './selectedCards.service';
import { SelectedCardsResponseDto } from './dto/selected-cards-response.dto';
import { SelectedCardsCommand } from './selectedCards.command';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ROLES, Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Reflector } from '@nestjs/core';
import { JWT } from '../auth/jwt.decorator';

@ApiTags('SelectedCards')
@ApiBearerAuth()
@Controller('lobbies/rounds')
@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
export class SelectedCardsController {
  constructor(
    private readonly selectedService: SelectedCardsService,
    private readonly selectCommand: SelectedCardsCommand,
  ) {}

  @ApiOperation({ summary: 'Get selected cards of a player by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns selected cards by player id ',
    type: SelectedCardsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Selected cards not found' })
  @Get(':round_id/players/:player_id/cards')
  @Roles(ROLES.PLAYER, ROLES.ADMIN)
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
  @Get(':round_id/cards')
  @Roles(ROLES.PLAYER, ROLES.ADMIN)
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
  @Put(':round_id/select-cards/like/:id')
  @Roles(ROLES.PLAYER)
  async addCardToLiked(
    @JWT() { playerId }: { playerId: string },
    @Param('round_id') roundId: string,
    @Param('id') cardId: string,
  ): Promise<SelectedCardsResponseDto> {
    return new SelectedCardsResponseDto(
      await this.selectCommand.likeACard({ playerId, roundId, cardId }),
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
  @Delete(':round_id/select-cards/unlike/:id')
  @Roles(ROLES.PLAYER)
  async removeCardFromLiked(
    @JWT() { playerId }: { playerId: string },
    @Param('round_id') roundId: string,
    @Param('id') cardId: string,
  ): Promise<SelectedCardsResponseDto> {
    return new SelectedCardsResponseDto(
      await this.selectCommand.unLikeACard({ playerId, roundId, cardId }),
    );
  }

  @ApiOperation({ summary: 'Finish the selection player of cards of a player' })
  @ApiResponse({
    status: 200,
    description: 'Returns the new selected cards array ',
    type: SelectedCardsResponseDto,
  })
  @Put(':round_id/select-cards/finish')
  @Roles(ROLES.PLAYER)
  async finishedSelecting(
    @JWT() { playerId }: { playerId: string },
    @Param('round_id') roundId: string,
  ): Promise<SelectedCardsResponseDto> {
    return new SelectedCardsResponseDto(
      await this.selectCommand.finishedSelecting(roundId, playerId),
    );
  }
}
