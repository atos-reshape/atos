import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { LobbyController } from "./lobby.controller";
import { LobbyService } from "./lobby.service";
import { Lobby } from "./lobby.entity";

@Module({
    imports: [MikroOrmModule.forFeature([Lobby])],
    controllers: [LobbyController],
    providers: [LobbyService],
})

export class LobbiesModule {}
