import { v4 } from 'uuid';
import { Round } from '../../src/round/round.entity';
import { faker } from '@faker-js/faker';
import { MikroORM } from '@mikro-orm/core';

export const round = (data: Partial<Round> = {}, orm?: MikroORM): Round => {
  let round = {
    id: v4(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    cards: [v4(), v4()],
    ...data,
  } as Round;

  if (!!orm) {
    round = orm.em.create(Round, round);
    orm.em.persist(round);
  }

  return round;
};
