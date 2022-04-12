import { Controller, Get, Injectable, Post, UseGuards } from '@nestjs/common';
import { OIDCStrategy } from 'passport-azure-ad';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';

@Injectable()
export class ActiveDirectoryStrategy extends PassportStrategy(
  OIDCStrategy,
  'oauth-bearer',
) {
  constructor() {
    super({
      identityMetadata:
        'https://login.microsoftonline.com/e2dd5dd5-cd84-46b3-a607-518b52272bb7/.well-known/openid-configuration',
      clientID: 'c64a4147-29bc-403a-918b-178a85e2d7dc',
      responseType: 'code id_token',
      responseMode: 'form_post',
      redirectUrl: 'http://localhost:3002/api/auth/openid/return',
      allowHttpForRedirectUrl: true,
      clientSecret: 'd22a4643-e119-40e6-85f6-eda46711dfe6',
    });
  }

  async validate(response: any) {
    const { unique_name }: { unique_name: string } = response;
    if (unique_name) return unique_name;
    else return null;
  }
}

@Controller()
export class AppController {
  @UseGuards(AuthGuard('oauth-bearer'))
  @Get('protected')
  protected(): string {
    return 'Protected';
  }

  @Post('auth/openid/return')
  handleRedirect(test, data) {
    console.log(test, data);
  }
}
