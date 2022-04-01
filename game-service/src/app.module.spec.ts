import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { LobbyModule } from './lobby/lobby.module';
import { RoundModule } from './round/round.module';

describe('MainModule', () => {
  let module;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
    expect(module.get(LobbyModule)).toBeInstanceOf(LobbyModule);
    expect(module.get(RoundModule)).toBeInstanceOf(RoundModule);
  });

  afterAll(async () => {
    await module.close();
  });
});
