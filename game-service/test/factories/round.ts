import { v4 } from 'uuid';
import { Round } from '../../src/round/round.entity';
import { faker } from '@faker-js/faker';

export const round = (data: Partial<Round> = {}): Round => {
  return {
    id: v4(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    cards: [v4(), v4()],
    ...data,
  } as Round;
};
