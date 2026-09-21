import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { PrismaModule } from './common/prisma/prisma.module';
import { TextEngineModule } from './modules/text-engine/text-engine.module';
import { FileParserModule } from './modules/file-parser/file-parser.module';
import { StatsModule } from './modules/stats/stats.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    PrismaModule,
    TextEngineModule,
    FileParserModule,
    StatsModule,
    DictionaryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
