import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'player-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * This method is called on every request to validate our custom JWT payload.
   * We can add additional request information that is usefully in controllers.
   * You can access the payload as follows: @Request request as param,
   * And then request.user to get the payload returned below.
   * @param payload is the payload within the JWT
   * @returns the payload as part of the @Request request property in controller functions.
   */
  validate(payload: JwtPayloadDto): JwtPayloadDto {
    return { lobbyId: payload.lobbyId, playerId: payload.playerId };
  }
}
