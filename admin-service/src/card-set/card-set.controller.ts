import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CardSetService } from './card-set.service';
import { CreateCardSetDto } from './dtos/create-card-set.dto';
import { CardSet } from './entities/card-set.entity';

@ApiTags('card-set')
@Controller('card-set')
export class CardSetController {
  constructor(private readonly cardSetService: CardSetService) {}

  @ApiOperation({ summary: 'Get all card sets' })
  @ApiQuery({ name: 'isActive' })
  @ApiResponse({ status: 200, description: 'Returned all card sets' })
  @Get()
  async findAll(@Query('isActive') isActive = true): Promise<CardSet[]> {
    return this.cardSetService.findAll(isActive);
  }

  @ApiOperation({ summary: 'Get a card set by id' })
  @ApiResponse({ status: 200, description: 'Returned card set by id' })
  @ApiResponse({ status: 404, description: 'Card set not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CardSet> {
    return this.cardSetService.findOne(id);
  }

  @ApiOperation({ summary: 'Create card set' })
  @ApiResponse({ status: 201, description: 'Card set created' })
  @ApiResponse({ status: 400, description: 'Invalid card set' })
  @ApiResponse({ status: 409, description: 'Card set already exists' })
  @Post()
  async create(@Body() card: CreateCardSetDto): Promise<CardSet> {
    return this.cardSetService.create(card);
  }

  @ApiOperation({ summary: 'Update card set' })
  @ApiResponse({ status: 200, description: 'Card set updated' })
  @ApiResponse({ status: 400, description: 'Invalid card set' })
  @ApiResponse({ status: 404, description: 'Card set not found' })
  @ApiResponse({ status: 409, description: 'Card set already exists' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() card: CreateCardSetDto,
  ): Promise<CardSet> {
    return this.cardSetService.update(id, card);
  }

  @ApiOperation({ summary: 'Delete card set by id' })
  @ApiResponse({ status: 200, description: 'Card set deleted' })
  @ApiResponse({ status: 404, description: 'Card set not found' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.cardSetService.delete(id);
  }
}
