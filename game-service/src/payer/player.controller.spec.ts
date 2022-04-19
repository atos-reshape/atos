import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule } from '@nestjs/config';
import { UseDatabaseTestConfig } from '../test/helpers/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Lobby } from '../lobby/lobby.entity';
import { Player } from './player.entity';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { lobby } from '@factories/lobby';
import { PlayerResponseDto } from './dto/player-response.dto';
import { player } from '@factories/player';
import { v4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { SocketService } from '../lobby/socket.service';
import { SelectedCardsService } from './selectedCards.service';
import { SelectedCards } from './selectedCards.entity';

describe('PlayerController', () => {
  let controller: PlayerController;
  let app: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        UseDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Lobby, Player, SelectedCards] }),
      ],
      controllers: [PlayerController],
      providers: [PlayerService, SocketService, SelectedCardsService],
    }).compile();

    controller = app.get<PlayerController>(PlayerController);
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
    expect(controller).toBeInstanceOf(PlayerController);
  });

  describe('getPlayers', () => {
    it('should return all players in a lobby', async () => {
      const p = player({ lobby: lobby({}, orm) }, orm);
      expect(await controller.getPlayers(p.lobby.id)).toMatchObject([
        {
          id: p.id,
          name: p.name,
        } as PlayerResponseDto,
      ]);
    });
  });

  describe('getPlayer', () => {
    describe('with correct player id', () => {
      it('should return one specific player', async () => {
        const l = lobby({}, orm);
        const p = player({ lobby: l }, orm);
        expect(await controller.getPlayer(p.id)).toEqual(
          new PlayerResponseDto(p),
        );
      });
    });

    describe('with non existing player id', () => {
      it('should return 404', async () => {
        await expect(controller.getPlayer(v4())).rejects.toThrowError(
          NotFoundException,
        );
      });
    });
  });
});
