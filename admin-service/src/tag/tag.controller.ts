import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse()
  @Get()
  async findAll(): Promise<Tag[]> {
    return await this.tagService.findAll();
  }

  @ApiOperation({ summary: 'Get tag by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tag> {
    return await this.tagService.findOne(id);
  }

  @ApiOperation({ summary: 'Get tag by name' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Get(':name')
  async findOneByName(@Param('name') name: string): Promise<Tag> {
    return await this.tagService.findOneByName(name);
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
