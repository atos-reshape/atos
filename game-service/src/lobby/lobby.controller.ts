import { Body, Controller, Get, Post } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { CreateLobby } from './dto/create-lobby.dto';

@Controller('lobbies')
export class LobbyController {
  constructor(private readonly lobbiesService: LobbyService) {}

  @Get()
  getLobbies(): Promise<any[]> {
    return this.lobbiesService.getAll();
  }

  @Post()
  createLobby(@Body() params: CreateLobby): any {
    return this.lobbiesService.createNewLobby(params);
  }
}
