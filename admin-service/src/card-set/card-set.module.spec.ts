import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { useDatabaseTestConfig } from '../../test/helpers/database';
import { CardSetController } from './card-set.controller';
import { CardSetService } from './card-set.service';
import { CardSet } from './entities/card-set.entity';

describe('CardSetModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        useDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [CardSet] }),
      ],
      controllers: [CardSetController],
      providers: [CardSetService],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
    expect(module.get(CardSetController)).toBeInstanceOf(CardSetController);
    expect(module.get(CardSetService)).toBeInstanceOf(CardSetService);
  });
});
