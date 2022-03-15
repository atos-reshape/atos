import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityRepository } from "@mikro-orm/postgresql"
import { Lobby } from "./lobby.entity";
import { CreateLobby } from "./dto/create-lobby.dto";

@Injectable()
export class LobbyService {
    constructor(
        @InjectRepository(Lobby)
        private readonly lobbyRepository: EntityRepository<Lobby>
    ) {}

    getAll(): Promise<Lobby[]> {
        return this.lobbyRepository.findAll();
    }

    createNewLobby(settings: CreateLobby): Lobby {
        let lobby = this.lobbyRepository.create(settings);

        return lobby;
    }
}