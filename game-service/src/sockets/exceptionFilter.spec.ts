import { ExceptionsFilter } from './exceptionFilter';
import { NotFoundException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

describe('ExceptionFilter', () => {
  const filter = new ExceptionsFilter();
  const superCatch = jest
    .spyOn(BaseWsExceptionFilter.prototype, 'catch')
    .mockReturnValue(undefined);

  it('should convert it to a websocket error', () => {
    filter.catch(new NotFoundException('Not Found'), undefined);
    expect(superCatch).toHaveBeenCalledWith(
      new WsException('Not Found'),
      undefined,
    );
  });
});
