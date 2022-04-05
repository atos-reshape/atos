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
import { CardService } from './card.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCardDto } from './dtos/create-card.dto';
import { Card } from './entities/card.entity';

/**
 * The REST API controller for the card service.
 */
@ApiTags('cards')
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ summary: 'Get all cards' })
  @ApiQuery({ name: 'isActive' })
  @ApiOkResponse()
  @Get()
  async findAll(@Query('isActive') isActive = true): Promise<Card[]> {
    return this.cardService.findAll(isActive);
  }

  @ApiOperation({ summary: 'Get card by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Card> {
    return this.cardService.findOne(id);
  }

  @ApiOperation({ summary: 'Create card' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @Post()
  async create(@Body() card: CreateCardDto): Promise<Card> {
    return this.cardService.create(card);
  }

  @ApiOperation({ summary: 'Update card' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() card: CreateCardDto,
  ): Promise<Card> {
    return this.cardService.update(id, card);
  }

  @ApiOperation({ summary: 'Delete card by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.cardService.delete(id);
  }
}
