import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketService {
  @WebSocketServer()
  server: Server;

  send(room: string, event: string, content: any) {
    this.server.to(room).emit(event, content);
  }
}
