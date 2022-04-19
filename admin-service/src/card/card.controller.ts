import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
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
import { CreateCardDto, PageOptionsDto } from './dtos';
import { Card } from './entities/card.entity';
import { paginate } from '../helpers/pagination.helper';
import { Request, Response } from 'express';

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
  async findAll(
    /* istanbul ignore next */
    @Query('isActive') isActive = true,
    @Query() pageOptions?: PageOptionsDto,
    @Query('language') language?: string,
    @Query('tag') tag?: string,
    @Res() response?: Response,
    @Req() request?: Request,
  ) {
    return response.json(
      paginate<Card>(
        request,
        response,
        await this.cardService.findAll(isActive, pageOptions, language, tag),
        pageOptions,
      ),
    );
  }

  @ApiOperation({ summary: 'Get card by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('language') language?: string,
  ): Promise<Card> {
    return this.cardService.findOne(id, language);
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
