import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule } from '@nestjs/config';
import { UseDatabaseTestConfig } from '../test/helpers/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Lobby } from '../lobby/lobby.entity';
import { Round } from './round.entity';
import { RoundController } from './round.controller';
import { RoundService } from './round.service';
import { round, lobby } from '@factories/index';
import { CreateRoundDto } from './dto/create-round.dto';
import { RoundResponseDto } from './dto/round-response.dto';

describe('RoundController', () => {
  let controller: RoundController;
  let app: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        UseDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Lobby, Round] }),
      ],
      controllers: [RoundController],
      providers: [RoundService],
    }).compile();

    controller = app.get<RoundController>(RoundController);
    orm = app.get<MikroORM>(MikroORM);
  });

  beforeEach(async () => {
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeInstanceOf(RoundController);
  });

  describe('getRounds', () => {
    it('should return all rounds of a lobby', async () => {
      const myRound = round({ lobby: lobby({}, orm) }, orm);
      expect(await controller.getRounds(myRound.lobby.id)).toMatchObject([
        {
          id: myRound.id,
          cards: myRound.cards,
          roundId: myRound.lobby.id,
        } as RoundResponseDto,
      ]);
    });
  });

  describe('createRound', () => {
    it('should create a new round and assign as current round', async () => {
      const existingLobby: Lobby = lobby({}, orm);
      const request: CreateRoundDto = {
        cards: ['id-1', 'id-2'],
      };
      expect(
        await controller.createRound(existingLobby.id, request),
      ).toMatchObject({ cards: request.cards } as RoundResponseDto);
    });
  });
});
