import { Catch, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(NotFoundException)
export class ExceptionsFilter extends BaseWsExceptionFilter {
  /**
   * Handler for our http not found exception, it throws an error
   * specific for websockets.
   * @param exception which is the thrown exception
   * @param host
   */
  catch(exception: NotFoundException, host: ArgumentsHost) {
    super.catch(new WsException(exception.message), host);
  }
}
