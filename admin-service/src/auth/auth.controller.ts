import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('oauth-bearer'))
  @Get('login/openid/azure-ad')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected(): void {}

  @Post('login/openid/return')
  handleRedirect(@Body() body, @Res() res: Response) {
    res.cookie('refresh', this.authService.newRefreshToken(body.id_token));
    res.redirect('/admin');
  }

  @Get('login/openid/refresh')
  handeRefresh(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    if (!req.cookies.refresh) throw new UnauthorizedException();

    return this.authService.createAccessToken(req.cookies.refresh);
  }
}
