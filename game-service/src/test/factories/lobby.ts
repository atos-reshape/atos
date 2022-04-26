import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Lobby } from '../../lobby/lobby.entity';
import { generateGameCode } from '@helpers/index';
import { MikroORM } from '@mikro-orm/core';
import { Round } from '../../round/round.entity';

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

export const lobbyWithRound = (
  data: Partial<Lobby> = {},
  orm: MikroORM,
  started = true,
  ended = false,
): Lobby => {
  const lobby: Lobby = orm.em.create(Lobby, {
    id: v4(),
    code: generateGameCode(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    title: faker.lorem.sentence(5),
    ...data,
  });

  const activeRound = orm.em.create(Round, {
    id: v4(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    startedAt: started ? faker.date.recent() : null,
    endedAt: ended ? faker.date.recent() : null,
  });

  lobby.rounds.add(activeRound);
  lobby.currentRound = activeRound;
  orm.em.persistAndFlush([lobby, activeRound]);

  return lobby;
};
