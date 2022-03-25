import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { CardModule } from './card/card.module';
import { useDatabaseTestConfig } from '../test/helpers/database';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [useDatabaseTestConfig(), AppModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
    expect(module.get(CardModule)).toBeInstanceOf(CardModule);
  });
});
