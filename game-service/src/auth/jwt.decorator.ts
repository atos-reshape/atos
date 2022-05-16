import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

export const JWT = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtPayloadDto => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().user;
    }

    throw new UnauthorizedException();
  },
);
