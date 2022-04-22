import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Card } from './entities/card.entity';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { useDatabaseTestConfig } from '../../test/helpers/database';
import { TagModule } from '../tag/tag.module';

describe('CardModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        useDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Card] }),
        TagModule,
      ],
      controllers: [CardController],
      providers: [CardService],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
    expect(module.get(CardController)).toBeInstanceOf(CardController);
    expect(module.get(CardService)).toBeInstanceOf(CardService);
    expect(module.get(TagModule)).toBeInstanceOf(TagModule);
  });
});
