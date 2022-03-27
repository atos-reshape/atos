import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CardSetService } from './card-set.service';
import { CreateCardSetDto } from './dtos/create-card-set.dto';
import { CardSet } from './entities/card-set.entity';

@ApiTags('card-set')
@Controller('card-set')
export class CardSetController {
  constructor(private readonly cardSetService: CardSetService) {}

  @ApiOperation({ summary: 'Get all card sets' })
  @ApiResponse({ status: 200, description: 'Returned all card sets' })
  @Get()
  async findAll(): Promise<CardSet[]> {
    return this.cardSetService.findAll();
  }

  @ApiOperation({ summary: 'Get card sets by id' })
  @ApiResponse({ status: 200, description: 'Returned card sets by id' })
  @ApiResponse({ status: 404, description: 'Card sets not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CardSet> {
    return this.cardSetService.findOne(id);
  }

  @ApiOperation({ summary: 'Create card set' })
  @ApiResponse({ status: 201, description: 'Card set created' })
  @ApiResponse({ status: 400, description: 'Invalid card set' })
  @ApiResponse({ status: 409, description: 'Card set already exists' })
  @Post()
  async create(@Body() cardSet: CreateCardSetDto): Promise<CardSet> {
    return this.cardSetService.create(cardSet);
  }

  @ApiOperation({ summary: 'Update card set' })
  @ApiResponse({ status: 200, description: 'Card set updated' })
  @ApiResponse({ status: 400, description: 'Invalid card set' })
  @ApiResponse({ status: 404, description: 'Card set not found' })
  @ApiResponse({ status: 409, description: 'Card set already exists' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() cardSet: CreateCardSetDto,
  ): Promise<CardSet> {
    return this.cardSetService.update(id, cardSet);
  }

  @ApiOperation({ summary: 'Delete card set by id' })
  @ApiResponse({ status: 200, description: 'Card set deleted' })
  @ApiResponse({ status: 404, description: 'Card set not found' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.cardSetService.delete(id);
  }
}
