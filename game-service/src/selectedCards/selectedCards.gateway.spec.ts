import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UseDatabaseTestConfig } from '../test/helpers/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Lobby } from '../lobby/lobby.entity';
import { Round } from '../round/round.entity';
import { SelectedCards } from './selectedCards.entity';
import { LobbyService } from '../lobby/lobby.service';
import { RoundService } from '../round/round.service';
import { SelectedCardsService } from './selectedCards.service';
import { SelectedCardsGateway } from './selectedCards.gateway';
import { SocketService } from '../lobby/socket.service';
import { SelectedCardsCommand } from './selectedCards.command';
import { lobbyWithRound } from '@factories/lobby';
import { v4 } from 'uuid';
import { player } from '@factories/player';
import { selectedCards } from '@factories/selectedCards';
import { Joined } from '../sockets/joined.type';
import { PlayerSelectedCardsDto } from './dto/player-selected-cards.dto';
import { SelectedCardsResponseDto } from './dto/selected-cards-response.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('SelectedCards', () => {
  let gateway: SelectedCardsGateway;
  let app: TestingModule;
  let orm: MikroORM;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: 'JWT-TEST-secret',
          signOptions: { issuer: 'game-service' },
        }),
        UseDatabaseTestConfig(),
        MikroOrmModule.forFeature({ entities: [Lobby, Round, SelectedCards] }),
      ],
      controllers: [SelectedCardsGateway],
      providers: [
        LobbyService,
        RoundService,
        SelectedCardsService,
        SocketService,
        SelectedCardsCommand,
      ],
    }).compile();

    gateway = app.get<SelectedCardsGateway>(SelectedCardsGateway);
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
    expect(gateway).toBeDefined();
  });

  describe('getSelectedCards', () => {
    describe('with correct lobby_id', () => {
      it('should return all the selected cards of all players', async () => {
        const l = lobbyWithRound({}, orm);
        const p = player({ lobby: l }, orm);
        const s = selectedCards(
          { player: p, round: l.currentRound, cards: [v4(), v4()] },
          orm,
        );

        const socket = {
          join: (data: any): void => data,
          lobbyId: l.id,
        } as Joined;
        const response: PlayerSelectedCardsDto = {
          [s.player.id]: {
            id: s.id,
            playerId: s.player.id,
            cards: s.cards,
            roundId: s.round.id,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          } as SelectedCardsResponseDto,
        };
        expect(await gateway.getSelectedCards(socket)).toEqual(response);
      });
    });

    describe('with incorrect lobby_id', () => {
      it('should throw UnauthorizedException', async () => {
        await expect(
          gateway.getSelectedCards({ lobbyId: '' } as Joined),
        ).rejects.toThrow(UnauthorizedException);
      });
    });
  });

  describe('getMySelectedCards', () => {
    describe('with correct lobby_id and player_id', () => {
      it('should return the selected cards of that player', async () => {
        const l = lobbyWithRound({}, orm);
        const p = player({ lobby: l }, orm);
        const playerSelectedCards = selectedCards(
          { player: p, round: l.currentRound, cards: [v4(), v4()] },
          orm,
        );

        const socket = {
          join: (data: any): void => data,
          lobbyId: l.id,
          playerId: p.id,
        } as Joined;
        expect(await gateway.getMySelectedCards(socket)).toEqual(
          new SelectedCardsResponseDto(playerSelectedCards),
        );
      });
    });

    describe('with incorrect lobby_id or player_id', () => {
      it('should throw UnauthorizedException', async () => {
        await expect(
          gateway.getMySelectedCards({ playerId: '' } as Joined),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw UnauthorizedException', async () => {
        await expect(
          gateway.getMySelectedCards({ lobbyId: '' } as Joined),
        ).rejects.toThrow(UnauthorizedException);
      });
    });
  });
});
