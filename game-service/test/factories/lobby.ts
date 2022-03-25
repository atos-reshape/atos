import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Lobby } from '../../src/lobby/lobby.entity';
import generateGameCode from '../../src/helpers/gameCodeGenerator.helper';

export const lobby = (data: Partial<Lobby> = {}): Lobby => {
  return {
    id: v4(),
    code: generateGameCode(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    title: faker.lorem.sentence(5),
    ...data,
  } as Lobby;
};
