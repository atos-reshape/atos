import { Module } from '@nestjs/common';
import { SetService } from './set.service';
import { SetController } from './set.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Set } from './entities/set.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Set])],
  providers: [SetService],
  controllers: [SetController],
})
export class SetModule {}
