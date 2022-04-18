import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  LobbyResponseDto,
  responseWithCurrentRound,
  CreateLobbyDto,
} from './dto';

@ApiTags('Lobby')
@Controller('lobbies')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @ApiOperation({ summary: 'Get all lobbies' })
  @ApiResponse({
    status: 200,
    description: 'Returns all lobbies',
    type: [LobbyResponseDto],
  })
  @Get()
  async getLobbies(): Promise<LobbyResponseDto[]> {
    const lobbies = await this.lobbyService.getAll();
    return lobbies.map((lobby) => new LobbyResponseDto(lobby));
  }

  @ApiOperation({ summary: 'Get lobby by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns lobby by id ',
    schema: responseWithCurrentRound,
  })
  @ApiResponse({ status: 404, description: 'Lobby not found' })
  @SerializeOptions({ groups: ['withCurrentRound'] })
  @Get(':id')
  async getLobby(@Param('id') id: string): Promise<LobbyResponseDto> {
    return new LobbyResponseDto(await this.lobbyService.getById(id));
  }

  @ApiOperation({ summary: 'Create a new lobby' })
  @ApiResponse({
    status: 201,
    description: 'Lobby created',
    schema: responseWithCurrentRound,
  })
  @ApiResponse({ status: 400, description: 'Invalid lobby' })
  @SerializeOptions({ groups: ['withCurrentRound'] })
  @Post()
  async createLobby(@Body() params: CreateLobbyDto): Promise<LobbyResponseDto> {
    return new LobbyResponseDto(await this.lobbyService.createNewLobby(params));
  }
}
