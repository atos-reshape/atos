import { Test, TestingModule } from '@nestjs/testing';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';
import { Lobby } from './lobby.entity';
import { lobby, round } from '@factories/index';
import { CreateLobbyDto } from './dto/create-lobby.dto';

describe('LobbyController', () => {
  let controller: LobbyController;
  let app: TestingModule;

  const currentRound = round();
  const lobbies = [lobby(), lobby({ currentRound })];
  const createdLobby = lobby();
  const mockLobbyService = {
    getAll: jest.fn((): Lobby[] => lobbies),
    getById: jest.fn((id: string) => lobbies.find((value) => value.id == id)),
    createNewLobby: jest.fn((createLobbyDTO: CreateLobbyDto) => {
      return {
        ...createdLobby,
        title: createLobbyDTO.title,
        currentRound: {
          cards: createLobbyDTO.cards,
        },
      } as Lobby;
    }),
  };

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [LobbyController],
      providers: [LobbyService],
    })
      .overrideProvider(LobbyService)
      .useValue(mockLobbyService)
      .compile();

    controller = app.get<LobbyController>(LobbyController);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLobbies', () => {
    it('should return all lobbies', async () => {
      expect(await controller.getLobbies()).toEqual(lobbies);
    });
  });

  describe('getLobby', () => {
    it('should return one specific lobby', async () => {
      expect(await controller.getLobby(lobbies[0].id)).toEqual(lobbies[0]);
    });
  });

  describe('createLobby', () => {
    it('should create a new lobby including a new round', async () => {
      const request: CreateLobbyDto = {
        title: 'some-title',
        cards: ['card-id'],
      };
      expect(await controller.createLobby(request)).toEqual({
        ...createdLobby,
        title: request.title,
        currentRound: {
          cards: request.cards,
        },
      } as Lobby);
    });
  });
});
