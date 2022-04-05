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
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CardSetService } from './card-set.service';
import { CreateCardSetDto } from './dtos/create-card-set.dto';
import { CardSet } from './entities/card-set.entity';

@ApiTags('card-set')
@Controller('card-set')
export class CardSetController {
  constructor(private readonly cardSetService: CardSetService) {}

  @ApiOperation({ summary: 'Get all card sets' })
  @ApiQuery({ name: 'isActive' })
  @ApiOkResponse()
  @Get()
  async findAll(@Query('isActive') isActive = true): Promise<CardSet[]> {
    return this.cardSetService.findAll(isActive);
  }

  @ApiOperation({ summary: 'Get a card set by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CardSet> {
    return this.cardSetService.findOne(id);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @Post()
  async create(@Body() cardSet: CreateCardSetDto): Promise<CardSet> {
    return this.cardSetService.create(cardSet);
  }

  @ApiOperation({ summary: 'Update card set' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() cardSet: CreateCardSetDto,
  ): Promise<CardSet> {
    return this.cardSetService.update(id, cardSet);
  }

  @ApiOperation({ summary: 'Delete card set by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.cardSetService.delete(id);
  }
}
