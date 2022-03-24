import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { Lobby } from './lobby.entity';

@Controller('lobbies')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Get()
  getLobbies(): Promise<Lobby[]> {
    return this.lobbyService.getAll();
  }

  @Get(':id')
  getLobby(@Param('id') id: string): Promise<Lobby> {
    return this.lobbyService.getById(id);
  }

  @Post()
  createLobby(@Body() params: CreateLobbyDto): Promise<Lobby> {
    console.log(params);
    return this.lobbyService.createNewLobby(params);
  }
}
