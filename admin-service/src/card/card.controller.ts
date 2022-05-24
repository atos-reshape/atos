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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CardService } from './card.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCardDto, PageOptionsDto } from './dtos';
import { Card } from './entities/card.entity';
import { paginate } from '../helpers/pagination.helper';
import { Express, Request, Response } from 'express';
import { FindOneOptionsDto } from './dtos/find-one-options.dto';
import { FindAllCardOptionsDto } from './dtos/find-all-card-options.dto';
import { FileInterceptor } from '@nestjs/platform-express';

/**
 * The REST API controller for the card service.
 */
@ApiTags('cards')
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ summary: 'Get all cards' })
  @ApiOkResponse()
  @Get()
  async findAll(
    @Query() findAllOptions?: FindAllCardOptionsDto,
    @Query() pageOptions?: PageOptionsDto,
    @Res({ passthrough: true }) response?: Response,
    @Req() request?: Request,
  ): Promise<Card[]> {
    return paginate<Card>(
      request,
      response,
      await this.cardService.findAll(findAllOptions, pageOptions),
      pageOptions,
    );
  }

  @ApiOperation({ summary: 'Get card by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query() findOneOptions?: FindOneOptionsDto,
  ): Promise<Card> {
    return this.cardService.findOne(id, findOneOptions);
  }

  @ApiOperation({ summary: 'Create card' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @Post()
  async create(@Body() card: CreateCardDto): Promise<Card> {
    return this.cardService.create(card);
  }

  @ApiOperation({ summary: 'Create cards from .csv file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async createFromFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Card[]> {
    console.log(file);
    return this.cardService.createFromFile(file);
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
