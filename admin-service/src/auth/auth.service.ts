import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAdminPayloadDto } from './dto/jwt-admin-payload.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  newRefreshToken(token: string) {
    const payload: any = this.jwtService.decode(token);
    return this.jwtService.sign({
      email: payload.email,
      name: payload.name,
      role: 'ADMIN',
    } as JwtAdminPayloadDto);
  }

  createAccessToken(refresh: string) {
    const payload: any = this.jwtService.verify(refresh);
    return {
      accessToken: this.jwtService.sign({
        email: payload.email,
        name: payload.name,
        role: 'ADMIN',
      } as JwtAdminPayloadDto),
    };
  }
}
