import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Card } from '../card/entities/card.entity';

export const card = (data: Partial<Card> = {}): Card => {
  return {
    id: v4(),
    text: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...data,
  } as Card;
};
