import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // THESE PROXIES ARE NOT PROD READY
  // THEY PASS ON ANY ERROR SINCE THERE IS NO BOUNDARY
  // BUT FOR NOW WE CAN USE IT DURING DEVELOPMENT
  const app = await NestFactory.create(GatewayModule, { bodyParser: false });
  app.setGlobalPrefix('api');

  const logger = new Logger('ProxyMiddleware');
  const logProvider = {
    info: (...args: any[]) => logger.log(args),
    debug: (...args: any[]) => logger.log(args),
    error: (...args: any[]) => logger.log(args),
    warn: (...args: any[]) => logger.log(args),
    log: (...args: any[]) => logger.log(args),
  };

  // Game service api proxy
  app.use(
    '/api/lobbies',
    createProxyMiddleware({
      target: `http://${process.env.GAME_SERVICE_HOST}:${process.env.GAME_SERVICE_PORT}`,
      changeOrigin: true,
      logLevel: 'debug',
      logProvider: () => logProvider,
    }),
  );

  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: `http://${process.env.GAME_SERVICE_HOST}:${process.env.GAME_SERVICE_PORT}`,
      changeOrigin: true,
      logLevel: 'debug',
      logProvider: () => logProvider,
    }),
  );

  // Admin service api proxy
  app.use(
    '/api/cards',
    createProxyMiddleware({
      target: `http://${process.env.ADMIN_SERVICE_HOST}:${process.env.ADMIN_SERVICE_PORT}`,
      changeOrigin: true,
      logLevel: 'debug',
      logProvider: () => logProvider,
    }),
  );

  // Websocket connection for the lobby namespace
  app.use(
    '/lobby',
    createProxyMiddleware({
      target: `ws://${process.env.GAME_SERVICE_HOST}:${process.env.GAME_SERVICE_PORT}`,
      changeOrigin: true,
      ws: true,
      logLevel: 'debug',
      logProvider: () => logProvider,
    }),
  );

  app.use(
    '*',
    createProxyMiddleware({
      target: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
      changeOrigin: true,
      logLevel: 'debug',
      logProvider: () => logProvider,
    }),
  );

  await app.listen(process.env.PORT);
}

bootstrap();
