import { Injectable } from '@nestjs/common';
import { OIDCStrategy } from 'passport-azure-ad';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class ActiveDirectoryStrategy extends PassportStrategy(
  OIDCStrategy,
  'oauth-bearer',
) {
  constructor() {
    super({
      identityMetadata: `https://login.microsoftonline.com/${process.env.AD_TENANT_ID}/.well-known/openid-configuration`,
      clientID: process.env.AD_CLIENT_ID,
      responseType: 'code id_token',
      responseMode: 'form_post',
      redirectUrl: process.env.OAUTH_REDIRECT_URL,
      allowHttpForRedirectUrl: true,
      clientSecret: process.env.AD_CLIENT_SECRET,
    });
  }
}
