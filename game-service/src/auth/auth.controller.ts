import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoinLobbyDto } from './dto/join-lobby.dto';
import { AuthService } from './auth.service';
import { JoinResponseDto } from './dto/join-response.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Join a lobby as a player' })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined the lobby',
    type: JoinResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Lobby not found' })
  @Post('join/:code')
  async joinLobby(
    @Param('code') code: string,
    @Body() params: JoinLobbyDto,
  ): Promise<JoinResponseDto> {
    return this.authService.joinUsingCode(code, params);
  }
}
