import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { useDatabaseTestConfig } from '../../test/helpers/database';
import { SetController } from './set.controller';
import { SetService } from './set.service';
import { Set } from './entities/set.entity';
import { TagModule } from '../tag/tag.module';

describe('SetModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        useDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Set] }),
        TagModule,
      ],
      controllers: [SetController],
      providers: [SetService],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
    expect(module.get(SetController)).toBeInstanceOf(SetController);
    expect(module.get(SetService)).toBeInstanceOf(SetService);
  });
});
