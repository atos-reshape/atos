import { Socket } from 'socket.io';

export type Joined = Socket & { lobbyId: string };
