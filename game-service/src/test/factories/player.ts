import { MikroORM } from '@mikro-orm/core';
import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { Player } from '../../player/player.entity';

export const player = (data: Partial<Player> = {}, orm?: MikroORM): Player => {
  let player = {
    id: v4(),
    name: faker.name.firstName(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...data,
  } as Player;

  if (!!orm) {
    player = orm.em.create(Player, player);
    orm.em.persist(player);
  }

  return player;
};
