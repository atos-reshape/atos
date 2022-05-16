import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TagService } from './tag.service';
import { CreateTagDto } from './dtos/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { PageOptionsDto } from '../dtos/page-options.dto';
import { Request, Response } from 'express';
import { paginate } from '../helpers/pagination.helper';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse()
  @Get()
  async findAll(
    @Query() pageOptions?: PageOptionsDto,
    @Res({ passthrough: true }) response?: Response,
    @Req() request?: Request,
  ): Promise<Tag[]> {
    return paginate<Tag>(
      request,
      response,
      await this.tagService.findAll(pageOptions),
      pageOptions,
    );
  }

  @ApiOperation({ summary: 'Get tag by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tag> {
    return await this.tagService.findOne(id);
  }

  @ApiOperation({ summary: 'Create tag' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @Post()
  async create(@Body() tag: CreateTagDto): Promise<Tag> {
    return await this.tagService.create(tag);
  }

  @ApiOperation({ summary: 'Delete tag by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.tagService.delete(id);
  }
}
