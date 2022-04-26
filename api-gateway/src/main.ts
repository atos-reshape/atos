import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  // THESE PROXIES ARE NOT PROD READY
  // THEY PASS ON ANY ERROR SINCE THERE IS NO BOUNDARY
  // BUT FOR NOW WE CAN USE IT DURING DEVELOPMENT
  const httpsOptions = {
    // GENERATE USING https://letsencrypt.org/docs/certificates-for-localhost/
    key: fs.readFileSync('../localhost.key'),
    cert: fs.readFileSync('../localhost.crt'),
    rejectUnauthorized: false,
    requestCert: false,
  };
  const app = await NestFactory.create(GatewayModule, {
    bodyParser: false,
    httpsOptions,
  });
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
      target: `https://${process.env.GAME_SERVICE_HOST}:${process.env.GAME_SERVICE_PORT}`,
      changeOrigin: true,
      logLevel: 'debug',
      secure: false,
      logProvider: () => logProvider,
    }),
  );

  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: `https://${process.env.GAME_SERVICE_HOST}:${process.env.GAME_SERVICE_PORT}`,
      changeOrigin: true,
      logLevel: 'debug',
      secure: false,
      logProvider: () => logProvider,
    }),
  );

  // Admin service api proxy
  app.use(
    '/api/cards',
    createProxyMiddleware({
      target: `https://${process.env.ADMIN_SERVICE_HOST}:${process.env.ADMIN_SERVICE_PORT}`,
      changeOrigin: true,
      logLevel: 'debug',
      secure: false,
      logProvider: () => logProvider,
    }),
  );

  // Websocket connection for the lobby namespace
  app.use(
    '/lobby',
    createProxyMiddleware({
      target: `wss://${process.env.GAME_SERVICE_HOST}:${process.env.GAME_SERVICE_PORT}`,
      changeOrigin: true,
      ws: true,
      secure: false,
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
