import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { MikroORM } from '@mikro-orm/core';
import { CardTranslation } from '../../src/card/entities/card-translation.entity';

export const cardTranslation = (
  data: Partial<CardTranslation> = {},
  orm?: MikroORM,
): CardTranslation => {
  let cardTranslation = {
    id: v4(),
    text: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    language: 'en',
    isDefaultLanguage: true,
    ...data,
  } as CardTranslation;

  if (!!orm) {
    cardTranslation = orm.em.create(CardTranslation, cardTranslation);
    orm.em.persist(cardTranslation);
  }

  return cardTranslation;
};

export const createCardTranslations = (
  translations: Partial<CardTranslation>[],
  orm?: MikroORM,
): CardTranslation[] => {
  return translations.map((translation) => cardTranslation(translation, orm));
};
