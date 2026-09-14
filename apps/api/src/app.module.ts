import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './common/prisma/prisma.module';
import { TextEngineModule } from './modules/text-engine/text-engine.module';

@Module({
  imports: [PrismaModule, TextEngineModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
