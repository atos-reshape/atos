import { INestApplication } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { useLogger } from './logger.proxy';

function useHttpProxy(target: string) {
  return createProxyMiddleware({
    target: target,
    changeOrigin: true,
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    logProvider: useLogger,
  });
}

export const registerProxyGateway = (app: INestApplication) => {
  const proxies: { [key: string]: string } = {
    // Game service api proxy
    '/api/lobbies': `http://${process.env.GAME_SERVICE_HOST}:${process.env.GAME_SERVICE_PORT}`,
    '/api/auth': `http://${process.env.GAME_SERVICE_HOST}:${process.env.GAME_SERVICE_PORT}`,
    '/docs/game-service': `http://${process.env.GAME_SERVICE_HOST}:${process.env.GAME_SERVICE_PORT}`,
    // Admin service api proxy
    '/api/cards': `http://${process.env.ADMIN_SERVICE_HOST}:${process.env.ADMIN_SERVICE_PORT}`,
    '/api/login': `http://${process.env.ADMIN_SERVICE_HOST}:${process.env.ADMIN_SERVICE_PORT}`,
    '/api/tags': `http://${process.env.ADMIN_SERVICE_HOST}:${process.env.ADMIN_SERVICE_PORT}`,
    '/docs/admin-service': `http://${process.env.ADMIN_SERVICE_HOST}:${process.env.ADMIN_SERVICE_PORT}`,
    // Frontend apps
    '*': `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
  };

  for (const [path, target] of Object.entries(proxies)) {
    app.use(path, useHttpProxy(target));
  }
};
