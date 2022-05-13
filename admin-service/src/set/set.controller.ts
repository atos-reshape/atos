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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SetService } from './set.service';
import { CreateSetDto } from './dtos/create-set.dto';
import { Set } from './entities/set.entity';
import { PageOptionsDto } from '../dtos/page-options.dto';
import { Request, Response } from 'express';
import { FindAllSetOptionsDto } from './dtos/find-all-set-options.dto';
import { paginate } from '../helpers/pagination.helper';

@ApiTags('sets')
@Controller('sets')
export class SetController {
  constructor(private readonly setService: SetService) {}

  @ApiOperation({ summary: 'Get all card sets' })
  @ApiOkResponse()
  @Get()
  async findAll(
    @Query() findAllOptions?: FindAllSetOptionsDto,
    @Query() pageOptions?: PageOptionsDto,
    @Res({ passthrough: true }) response?: Response,
    @Req() request?: Request,
  ): Promise<Set[]> {
    return paginate<Set>(
      request,
      response,
      await this.setService.findAll(findAllOptions, pageOptions),
      pageOptions,
    );
  }

  @ApiOperation({ summary: 'Get a card set by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Set> {
    return this.setService.findOne(id);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @Post()
  async create(@Body() cardSet: CreateSetDto): Promise<Set> {
    return this.setService.create(cardSet);
  }

  @ApiOperation({ summary: 'Update card set' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() cardSet: CreateSetDto,
  ): Promise<Set> {
    return this.setService.update(id, cardSet);
  }

  @ApiOperation({ summary: 'Delete card set by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.setService.delete(id);
  }
}
