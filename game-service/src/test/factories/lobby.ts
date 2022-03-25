import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Lobby } from '../../lobby/lobby.entity';
import { generateGameCode } from '@helpers/index';
import { MikroORM } from '@mikro-orm/core';

export const lobby = (data: Partial<Lobby> = {}, orm?: MikroORM): Lobby => {
  let lobby = {
    id: v4(),
    code: generateGameCode(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    title: faker.lorem.sentence(5),
    ...data,
  } as Lobby;

  if (!!orm) {
    lobby = orm.em.create(Lobby, lobby);
    orm.em.persist(lobby);
  }

  return lobby;
};

export const createLobbies = (
  lobbies: Partial<Lobby>[] = [],
  orm?: MikroORM,
): Lobby[] => {
  const result = lobbies.map((l: Partial<Lobby>) => lobby(l, orm));

  if (!!orm) {
    result.forEach((l) => orm.em.persist(l));
  }

  return result;
};
