import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Card } from '../../src/card/entities/card.entity';
import { CardSet } from 'src/card-set/entities/card-set.entity';
import { card } from './card';

export const cardSet = (data: Partial<CardSet> = {}): CardSet => {
  const cards: Card[] = [];
  for (let i = 0; i < 6; i++) {
    cards.push(card());
  }

  return {
    id: v4(),
    cardSet: cards,
    type: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...data,
  } as CardSet;
};
