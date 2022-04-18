import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Card } from '../../src/card/entities/card.entity';
import { MikroORM } from '@mikro-orm/core';
import { CardTranslation } from '../../src/card/entities/card-translation.entity';

export const card = (data: Partial<Card> = {}, orm?: MikroORM): Card => {
  let card = {
    id: v4(),
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
  return cards.map((c: Partial<Card>) => card(c, orm));
};

export const cardWithTranslation = (
  data: Partial<Card> = {},
  orm?: MikroORM,
): Card => {
  const card: Card = orm.em.create(Card, {
    id: v4(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...data,
  });

  const translation = orm.em.create(CardTranslation, {
    id: v4(),
    text: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    language: 'en',
    isDefaultLanguage: true,
    card,
  });

  card.translations.add(translation);
  orm.em.persistAndFlush(card);

  return card;
};
