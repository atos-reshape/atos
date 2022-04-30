import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { registerProxyGateway } from './proxy/routes.proxy';
import { registerSocketProxy } from './proxy/socket.proxy';

async function bootstrap() {
  // THESE PROXIES ARE NOT PROD READY
  // THEY PASS ON ANY ERROR SINCE THERE IS NO BOUNDARY
  // BUT FOR NOW WE CAN USE IT DURING DEVELOPMENT
  const app = await NestFactory.create(GatewayModule, { bodyParser: false });
  app.setGlobalPrefix('api');

  // Use socket proxy first since we use * in the second one
  registerSocketProxy(app);
  registerProxyGateway(app);

  await app.listen(process.env.PORT);
}

bootstrap();
