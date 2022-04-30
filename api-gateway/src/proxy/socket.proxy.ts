import { INestApplication } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { useLogger } from './logger.proxy';

export const registerSocketProxy = (app: INestApplication) => {
  // Websocket connection for the lobby namespace
  app.use(
    '/lobby',
    createProxyMiddleware({
      target: `ws://${process.env.GAME_SERVICE_HOST}:${process.env.GAME_SERVICE_PORT}`,
      changeOrigin: true,
      ws: true,
      logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      logProvider: useLogger,
    }),
  );
};
