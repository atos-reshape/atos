import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { MikroORM } from '@mikro-orm/core';
import { SelectedCards } from '../../payer/selectedCards.entity';

export const selectedCards = (
  data: Partial<SelectedCards> = {},
  orm?: MikroORM,
): SelectedCards => {
  let selectedCards = {
    id: v4(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    cards: [v4(), v4()],
    ...data,
  } as SelectedCards;

  if (!!orm) {
    selectedCards = orm.em.create(SelectedCards, selectedCards);
    orm.em.persist(selectedCards);
  }

  return selectedCards;
};
