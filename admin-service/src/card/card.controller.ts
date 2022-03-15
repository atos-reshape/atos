import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CardService } from './card.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCardDto } from './dtos/create-card.dto';
import { Card } from './entities/card.entity';

@ApiTags('cards')
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ summary: 'Get all cards' })
  @ApiResponse({ status: 200, description: 'Returned all cards' })
  @Get()
  async findAll(): Promise<Card[]> {
    return this.cardService.findAll();
  }

  @ApiOperation({ summary: 'Get card by id' })
  @ApiResponse({ status: 200, description: 'Returned card by id' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Card> {
    return this.cardService.findOne(id);
  }

  @ApiOperation({ summary: 'Create card' })
  @ApiResponse({ status: 201, description: 'Card created' })
  @ApiResponse({ status: 400, description: 'Invalid card' })
  @ApiResponse({ status: 409, description: 'Card already exists' })
  @Post()
  async create(@Body() card: CreateCardDto): Promise<Card> {
    return this.cardService.create(card);
  }

  @ApiOperation({ summary: 'Update card' })
  @ApiResponse({ status: 200, description: 'Card updated' })
  @ApiResponse({ status: 400, description: 'Invalid card' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiResponse({ status: 409, description: 'Card already exists' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() card: CreateCardDto,
  ): Promise<Card> {
    return this.cardService.update(id, card);
  }

  @ApiOperation({ summary: 'Delete card by id' })
  @ApiResponse({ status: 200, description: 'Card deleted' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.cardService.delete(id);
  }
}
