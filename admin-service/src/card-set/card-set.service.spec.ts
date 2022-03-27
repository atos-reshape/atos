import { Test, TestingModule } from '@nestjs/testing';
import { CardSetService } from './card-set.service';

describe('CardSetService', () => {
  let service: CardSetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardSetService],
    }).compile();

    service = module.get<CardSetService>(CardSetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
