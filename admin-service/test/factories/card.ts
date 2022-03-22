import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Card } from '../../src/card/entities/card.entity';
import { MikroORM } from '@mikro-orm/core';

export const card = (data: Partial<Card> = {}, orm?: MikroORM): Card => {
  let card = {
    id: v4(),
    text: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...data,
  } as Card;

  if (!!orm) {
    card = orm.em.create(Card, card);
    orm.em.persist(card);
  }

  return card;
};

export const createCards = (
  cards: Partial<Card>[] = [],
  orm?: MikroORM,
): Card[] => {
  const result = cards.map((c: Partial<Card>) => card(c, orm));

  if (!!orm) {
    result.forEach((c) => orm.em.persist(c));
  }

  return result;
};
