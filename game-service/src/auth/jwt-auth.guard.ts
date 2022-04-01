import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This is a guard specific for checking a JWT
 * Can be used on a controllers or controller method like this:
 * @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard(['player-jwt']) {}
